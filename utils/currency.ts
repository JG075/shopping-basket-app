import currency from "currency.js"

export const GBP = (value: number) => currency(value, { symbol: "£", separator: "," })
