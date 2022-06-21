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

    findProduct(id: number) {
        return this.items.find((i) => i.product.id === id)
    }

    addItem(product: Product, qty: number) {
        const productQty = new ProductQty({ product, qty })
        this.items.push(productQty)
    }

    changeItemQty(id: number, qty: number) {
        const item = this.findProduct(id)
        if (item) {
            item.qty = qty
        }
    }
}

export default Basket
