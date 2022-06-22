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

jest.mock("../api/product")

const productApiMock = productApi as jest.Mocked<typeof productApi>

const commonMockResponse = {
    data: [
        new Product({
            id: 1,
            name: "Face Mask",
            thumbnail: "/facemask.jpg",
            cost: 2.5,
        }),
        new Product({
            id: 2,
            name: "Toilet Roll",
            thumbnail: "/toiletroll.jpg",
            cost: 0.65,
        }),
    ],
}

const getAddToCartButton = (listItem: HTMLElement) =>
    within(listItem).getByRole("button", { name: /add to cart/i })
const addItemToCart = (user: UserEvent, listItem: HTMLElement, qty: number) => {
    const addToCartButton = getAddToCartButton(listItem)
    const promises = times(qty, user.click.bind(user, addToCartButton))
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

        for await (const { name, thumbnail, cost } of commonMockResponse.data) {
            expect(getByText(name)).toBeInTheDocument()
            await waitFor(() =>
                expect(getByRole("img", { name })).toHaveAttribute(
                    "src",
                    expect.stringContaining(thumbnail.replace("/", ""))
                )
            )
            expect(getByText(currency(cost).format())).toBeInTheDocument()
        }
    })

    it("allows a user to add a product to the cart and show product information", async () => {
        productApiMock.get.mockResolvedValue(commonMockResponse)
        const { user, findAllByRole, getByLabelText } = setup(<Index />)
        const listItems = await findAllByRole("listitem")
        const qtyToAdd = 1

        await addItemToCart(user, listItems[0], qtyToAdd)

        const withinTable = within(getByLabelText("shopping basket"))
        const firstProduct = commonMockResponse.data[0]

        expect(
            withinTable.getByText(`${qtyToAdd} ${firstProduct.name}`)
        ).toBeInTheDocument()
        expect(
            withinTable.getAllByText(currency(firstProduct.cost).format())
        ).toHaveLength(2)
    })

    it("if the user adds more than one item it increments it", async () => {
        productApiMock.get.mockResolvedValue(commonMockResponse)
        const { user, findAllByRole, getByLabelText } = setup(<Index />)
        const listItems = await findAllByRole("listitem")
        const qtyToAdd = 2

        await addItemToCart(user, listItems[0], qtyToAdd)

        const withinTable = within(getByLabelText("shopping basket"))
        const firstProduct = commonMockResponse.data[0]

        expect(
            withinTable.getByText(`${qtyToAdd} ${firstProduct.name}`)
        ).toBeInTheDocument()
        const totalAmount = firstProduct.cost * qtyToAdd
        expect(
            withinTable.getByText(currency(totalAmount).format())
        ).toBeInTheDocument()
    })

    it("allows the user to remove an item from the cart", async () => {
        productApiMock.get.mockResolvedValue(commonMockResponse)
        const { user, findAllByRole, getByLabelText } = setup(<Index />)
        const listItems = await findAllByRole("listitem")
        const qtyToAdd = 2

        await addItemToCart(user, listItems[0], qtyToAdd)

        const removeButton = within(listItems[0]).getByRole("button", {
            name: /remove item/i,
        })

        await user.click(removeButton)

        const withinTable = within(getByLabelText("shopping basket"))
        const firstProduct = commonMockResponse.data[0]

        const newQty = qtyToAdd - 1
        expect(
            withinTable.getByText(`${newQty} ${firstProduct.name}`)
        ).toBeInTheDocument()
        expect(
            withinTable.getAllByText(currency(firstProduct.cost).format())
        ).toHaveLength(2)
    })
})
