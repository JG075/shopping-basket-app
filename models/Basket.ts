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

    findProductIndex(id: number) {
        return this.items.findIndex((i) => i.product.id === id)
    }

    addItem(product: Product, qty: number) {
        if (qty < 1) {
            return
        }
        const productQty = new ProductQty({ product, qty })
        this.items.push(productQty)
    }

    deleteItem(id: number) {
        const index = this.findProductIndex(id)
        this.items.splice(index, 1)
    }

    updateItemQty(id: number, qty: number) {
        const item = this.findProduct(id)
        if (item) {
            item.qty += qty
            if (item.qty <= 0) {
                this.deleteItem(id)
            }
        }
    }
}

export default Basket
