import { render, waitFor, waitForElementToBeRemoved } from "@testing-library/react"

import productApi, { SuccessResponse } from "../api/product"
import Product from "../models/product"
import Index from "./index"

jest.mock("../api/product")

const productApiMock = productApi as jest.Mocked<typeof productApi>

describe("Index", () => {
    it("renders a loading state", () => {
        const returnValue = new Promise<SuccessResponse>(() => {})
        productApiMock.get.mockReturnValue(returnValue)
        const { getByText } = render(<Index />)
        expect(getByText("Loading...")).toBeInTheDocument()
    })

    it("renders an error state", async () => {
        productApiMock.get.mockRejectedValue(() => ({
            error: {
                status: 500,
                message: "Server error",
            },
        }))
        const { findByText } = render(<Index />)
        expect(await findByText("Error!")).toBeInTheDocument()
    })

    it("renders a list of products", async () => {
        const mockReponse = {
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
        productApiMock.get.mockResolvedValue(mockReponse)
        const { getByText, getByRole, queryByText } = render(<Index />)

        await waitForElementToBeRemoved(queryByText("Loading..."))

        mockReponse.data.forEach(async ({ name, thumbnail, cost }) => {
            expect(getByText(name)).toBeInTheDocument()
            await waitFor(() => expect(getByRole("img", { name })).toHaveAttribute("src", thumbnail))
            expect(getByText(`£${cost}`)).toBeInTheDocument()
        })
    })

    it("allows a user to add a product to the cart", () => {})
})
