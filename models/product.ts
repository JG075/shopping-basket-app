import { immerable } from "immer"

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
}

export default Product
