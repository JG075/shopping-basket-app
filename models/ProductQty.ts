import { immerable } from "immer"
import Product from "./Product"

interface ProductQtyAttrs {
    product: Product
    qty: number
}

interface ProductQty extends ProductQtyAttrs {}
class ProductQty {
    [immerable] = true

    constructor(opts: ProductQtyAttrs) {
        Object.assign(this, opts)
    }
}

export default ProductQty
