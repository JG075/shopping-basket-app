import { render } from "@testing-library/react"

import Index from "./index"

describe("Index", () => {
    it("renders a loading state", () => {
        const { getByText } = render(<Index />)
        expect(getByText("Loading...")).toBeInTheDocument()
    })
    it("renders an error state", () => {})
    it("renders a list of products", () => {})
    it("allows a user to add a product to the cart", () => {})
})
