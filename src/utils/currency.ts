import { default as currencyjs } from "currency.js"

const GBP = (value: number) =>
    currencyjs(value, { symbol: "£", separator: "," })

export const currency = (value: number) => GBP(value)
