import { immerable } from "immer"
import Product from "./Product"
import ProductQty from "./ProductQty"

interface BasketAttrs {
    items: ProductQty[]
}

interface Basket extends BasketAttrs {}
class Basket {
    [immerable] = true

    constructor(opts: BasketAttrs = { items: [] }) {
        Object.assign(this, opts)
    }

    addItem(product: Product, qty: number) {
        const productQty = new ProductQty({ product, qty })
        this.items.push(productQty)
    }
}

export default Basket
