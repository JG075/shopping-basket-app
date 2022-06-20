import { immerable } from "immer"
import { GBP } from "../utils/currency"

interface ProductAttrs {
    id: number
    name: string
    thumbnail: string
    cost: number
}

interface Product extends ProductAttrs {}
class Product {
    [immerable] = true

    constructor(opts: ProductAttrs) {
        Object.assign(this, opts)
    }

    get displayCost() {
        return GBP(this.cost).format()
    }
}

export default Product
