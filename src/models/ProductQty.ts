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

    get discount() {
        const applicableDiscounts = this.product.discounts.map((d) =>
            d.apply(this.qty)
        )
        if (applicableDiscounts.length > 0) {
            // Possibly return the best discount in the future
            return applicableDiscounts[0]
        } else {
            return 0
        }
    }
}

export default ProductQty
