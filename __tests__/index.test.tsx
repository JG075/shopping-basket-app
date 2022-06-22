import {
    waitFor,
    waitForElementToBeRemoved,
    within,
} from "@testing-library/react"

import productApi, { SuccessResponse } from "../api/product"
import Product from "../models/Product"
import { setup } from "../utils/testHelpers"
import Index from "../pages/index"
import { currency } from "../utils/currency"
import times from "lodash/times"
import { UserEvent } from "@testing-library/user-event/dist/types/setup"
import Discount from "../models/Discount"

jest.mock("../api/product")

const productApiMock = productApi as jest.Mocked<typeof productApi>

const commonMockResponse = {
    data: [
        new Product({
            id: 1,
            name: "Face Mask",
            thumbnail: "/facemask.jpg",
            cost: 2.5,
            discounts: [
                new Discount({
                    qtyRequirement: 2,
                    amount: 1,
                    text: "Two Face Masks for £4",
                }),
            ],
        }),
        new Product({
            id: 2,
            name: "Toilet Roll",
            thumbnail: "/toiletroll.jpg",
            cost: 0.65,
            discounts: [
                new Discount({
                    qtyRequirement: 6,
                    amount: 0.65,
                    text: "Six rolls of toilet paper for the price of five",
                }),
            ],
        }),
    ],
}

const getAddToCartButton = (listItem: HTMLElement) =>
    within(listItem).getByRole("button", { name: /add to cart/i })
const getRemoveItemButton = (listItem: HTMLElement) =>
    within(listItem).getByRole("button", { name: /remove item/i })

const addItemToCart = (user: UserEvent, listItem: HTMLElement, qty: number) => {
    const addToCartButton = getAddToCartButton(listItem)
    const promises = times(qty, user.click.bind(user, addToCartButton))
    return Promise.all(promises)
}
const removeItemFromCart = (
    user: UserEvent,
    listItem: HTMLElement,
    qty: number
) => {
    const removeItemButton = getRemoveItemButton(listItem)
    const promises = times(qty, user.click.bind(user, removeItemButton))
    return Promise.all(promises)
}

describe("Index", () => {
    it("renders a loading state", () => {
        const returnValue = new Promise<SuccessResponse>(() => {})
        productApiMock.get.mockReturnValue(returnValue)
        const { getByText } = setup(<Index />)
        expect(getByText("Loading...")).toBeInTheDocument()
    })

    it("renders an error state", async () => {
        productApiMock.get.mockRejectedValue(() => ({
            error: {
                status: 500,
                message: "Server error",
            },
        }))
        const { findByText } = setup(<Index />)
        expect(await findByText("Error!")).toBeInTheDocument()
    })

    it("renders a list of products", async () => {
        productApiMock.get.mockResolvedValue(commonMockResponse)
        const { getByText, getByRole, queryByText } = setup(<Index />)

        await waitForElementToBeRemoved(queryByText("Loading..."))

        for await (const {
            name,
            thumbnail,
            cost,
            discounts,
        } of commonMockResponse.data) {
            expect(getByText(name)).toBeInTheDocument()
            await waitFor(() =>
                expect(getByRole("img", { name })).toHaveAttribute(
                    "src",
                    expect.stringContaining(thumbnail.replace("/", ""))
                )
            )
            expect(getByText(currency(cost).format())).toBeInTheDocument()
            const firstDiscountText = discounts[0].text
            expect(
                getByText(firstDiscountText, { exact: false })
            ).toBeInTheDocument()
        }
    })

    it("allows a user to add a product to the cart and show product information", async () => {
        productApiMock.get.mockResolvedValue(commonMockResponse)
        const { user, findAllByRole, getAllByRole } = setup(<Index />)
        const listItems = await findAllByRole("listitem")
        const qtyToAdd = 1

        await addItemToCart(user, listItems[0], qtyToAdd)

        const withinTableBody = within(getAllByRole("rowgroup")[1])
        const firstProduct = commonMockResponse.data[0]

        expect(
            withinTableBody.getByText(`${qtyToAdd} ${firstProduct.name}`)
        ).toBeInTheDocument()
        expect(
            withinTableBody.getAllByText(currency(firstProduct.cost).format())
        ).toHaveLength(2)
    })

    it("if the user adds more than one item it increments it", async () => {
        productApiMock.get.mockResolvedValue(commonMockResponse)
        const { user, findAllByRole, getAllByRole } = setup(<Index />)
        const listItems = await findAllByRole("listitem")
        const qtyToAdd = 2

        await addItemToCart(user, listItems[0], qtyToAdd)

        const withinTableBody = within(getAllByRole("rowgroup")[1])
        const firstProduct = commonMockResponse.data[0]

        expect(
            withinTableBody.getByText(`${qtyToAdd} ${firstProduct.name}`)
        ).toBeInTheDocument()
        const totalAmount = firstProduct.cost * qtyToAdd
        expect(
            withinTableBody.getByText(currency(totalAmount).format())
        ).toBeInTheDocument()
    })

    it("allows the user to remove an item from the cart", async () => {
        productApiMock.get.mockResolvedValue(commonMockResponse)
        const { user, findAllByRole, getAllByRole } = setup(<Index />)
        const listItems = await findAllByRole("listitem")
        const qtyToAdd = 2
        const qtyToRemove = 1

        await addItemToCart(user, listItems[0], qtyToAdd)
        await removeItemFromCart(user, listItems[0], qtyToRemove)

        const withinTableBody = within(getAllByRole("rowgroup")[1])
        const firstProduct = commonMockResponse.data[0]

        const newQty = qtyToAdd - qtyToRemove
        expect(
            withinTableBody.getByText(`${newQty} ${firstProduct.name}`)
        ).toBeInTheDocument()
        expect(
            withinTableBody.getAllByText(currency(firstProduct.cost).format())
        ).toHaveLength(2)
    })

    it("removes an item from the basket when the quantity reaches 0", async () => {
        productApiMock.get.mockResolvedValue(commonMockResponse)
        const { user, findAllByRole, getAllByRole } = setup(<Index />)
        const listItems = await findAllByRole("listitem")
        const qtyToAdd = 1
        const qtyToRemove = qtyToAdd

        await addItemToCart(user, listItems[0], qtyToAdd)
        await removeItemFromCart(user, listItems[0], qtyToRemove)

        const withinTableBody = within(getAllByRole("rowgroup")[1])
        const firstProduct = commonMockResponse.data[0]

        expect(
            withinTableBody.queryByText(firstProduct.name)
        ).not.toBeInTheDocument()
    })

    it("shows a discount when the requirement is met", async () => {
        productApiMock.get.mockResolvedValue(commonMockResponse)
        const { user, findAllByRole, getAllByRole } = setup(<Index />)
        const listItems = await findAllByRole("listitem")

        await addItemToCart(user, listItems[0], 1)

        const withinTableBody = within(getAllByRole("rowgroup")[1])
        const discount = commonMockResponse.data[0].discounts[0]
        const getCurrencyText = (amount = discount.amount) =>
            currency(Math.abs(amount)).format()

        expect(
            withinTableBody.queryByText(getCurrencyText())
        ).not.toBeInTheDocument()

        await addItemToCart(user, listItems[0], 1)

        expect(withinTableBody.getByText(getCurrencyText())).toBeInTheDocument()

        await addItemToCart(user, listItems[0], 2)

        expect(
            withinTableBody.getByText(getCurrencyText(discount.amount * 2))
        ).toBeInTheDocument()
    })

    it("shows the total amount of all items with discounts applied", async () => {
        productApiMock.get.mockResolvedValue(commonMockResponse)
        const { user, findAllByRole, getAllByRole } = setup(<Index />)
        const listItems = await findAllByRole("listitem")
        const products = commonMockResponse.data
        const p1Discount = products[0].discounts[0]
        const p2Discount = products[1].discounts[0]

        await addItemToCart(user, listItems[0], p1Discount.qtyRequirement)
        await addItemToCart(user, listItems[1], p2Discount.qtyRequirement)

        const withinTableFooter = within(getAllByRole("rowgroup")[2])
        const p1Total =
            p1Discount.qtyRequirement * products[0].cost - p1Discount.amount
        const p2Total =
            p2Discount.qtyRequirement * products[1].cost - p2Discount.amount
        const expectedTotal = p1Total + p2Total

        expect(
            withinTableFooter.getByText(currency(expectedTotal).format())
        ).toBeInTheDocument()
    })
})
