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

        commonMockResponse.data.forEach(async ({ name, thumbnail, cost }) => {
            expect(getByText(name)).toBeInTheDocument()
            await waitFor(() =>
                expect(getByRole("img", { name })).toHaveAttribute(
                    "src",
                    thumbnail
                )
            )
            expect(getByText(`£${cost}`)).toBeInTheDocument()
        })
    })

    it("allows a user to add a product to the cart and show product information", async () => {
        productApiMock.get.mockResolvedValue(commonMockResponse)
        const { user, findAllByRole, getByLabelText } = setup(<Index />)
        const listItems = await findAllByRole("listitem")

        await user.click(
            within(listItems[0]).getByRole("button", { name: /add to cart/i })
        )

        const withinTable = within(getByLabelText("shopping basket"))
        const firstProduct = commonMockResponse.data[0]

        expect(
            withinTable.getByText(`1 ${firstProduct.name}`)
        ).toBeInTheDocument()
        expect(
            withinTable.getAllByText(currency(firstProduct.cost).format())
        ).toHaveLength(2)
    })

    it("if the user adds more than one item it increments it", async () => {
        const { user, findAllByRole, getByLabelText } = setup(<Index />)
        const listItems = await findAllByRole("listitem")

        const addToCartButton = within(listItems[0]).getByRole("button", {
            name: /add to cart/i,
        })

        await user.click(addToCartButton)
        await user.click(addToCartButton)

        const withinTable = within(getByLabelText("shopping basket"))
        const firstProduct = commonMockResponse.data[0]

        const newQty = 2
        expect(
            withinTable.getByText(`${newQty} ${firstProduct.name}`)
        ).toBeInTheDocument()
        const totalAmount = firstProduct.cost * newQty
        expect(
            withinTable.getByText(currency(totalAmount).format())
        ).toBeInTheDocument()
    })
})
