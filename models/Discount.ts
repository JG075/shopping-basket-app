import { immerable } from "immer"

interface DiscountAttrs {
    qtyRequirement: number
    amount: number
    text: string
}

interface Discount extends DiscountAttrs {}
class Discount {
    [immerable] = true

    constructor(opts: DiscountAttrs) {
        Object.assign(this, opts)
    }

    apply(qty: number) {
        const multiplier = Math.floor(qty / this.qtyRequirement)
        return qty >= this.qtyRequirement ? multiplier * this.amount : 0
    }
}

export default Discount
