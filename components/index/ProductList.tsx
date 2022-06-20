import { FC } from "react"

import Product from "../../models/product"
import ProductListItem from "./ProductListItem"

interface Props {
    products: Product[]
}

const ProductList: FC<Props> = ({ products }: Props) => {
    return (
        <ul
            css={{
                listStyle: "none",
                paddingLeft: 0,
                li: {
                    marginBottom: 20,
                },
                width: "100%",
            }}
        >
            {products.map(({ id, name, thumbnail, displayCost }) => {
                return (
                    <li key={id}>
                        <ProductListItem name={name} thumbnail={thumbnail} cost={displayCost} />
                    </li>
                )
            })}
        </ul>
    )
}

export default ProductList
