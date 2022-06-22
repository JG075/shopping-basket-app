import { immerable } from "immer"

import Discount from "./Discount"

interface ProductAttrs {
    id: number
    name: string
    thumbnail: string
    cost: number
    discounts: Discount[]
}

interface Product extends ProductAttrs {}
class Product {
    [immerable] = true

    constructor(opts: ProductAttrs) {
        Object.assign(this, opts)
    }
}

export default Product
