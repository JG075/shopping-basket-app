import { render } from "@testing-library/react"

import productApi from "../api/product"
import Index from "./index"

jest.mock("../api/product")

const productApiMock = productApi as jest.Mocked<typeof productApi>

describe("Index", () => {
    it("renders a loading state", () => {
        const { getByText } = render(<Index />)
        expect(getByText("Loading...")).toBeInTheDocument()
    })

    it("renders an error state", async () => {
        productApiMock.get.mockRejectedValue(() => ({ error: { status: 500, message: "Server error" } }))
        const { findByText } = render(<Index />)
        expect(await findByText("Error!")).toBeInTheDocument()
    })

    it("renders a list of products", () => {})
    it("allows a user to add a product to the cart", () => {})
})
