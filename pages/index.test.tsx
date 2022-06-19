import { render } from "@testing-library/react"

import Index from "./index"

describe("Index", () => {
    it("renders a loading state", () => {
        const { getByText } = render(<Index />)
        expect(getByText("Loading...")).toBeInTheDocument()
    })
})
