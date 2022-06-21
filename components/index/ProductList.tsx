import { FC } from "react"

import ProductListItem from "./ProductListItem"

interface Props {
    products: {
        id: number
        name: string
        thumbnail: string
        cost: number
    }[]
    onChange: (id: number, qty: number) => void
}

const ProductList: FC<Props> = ({ products, onChange }: Props) => {
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
            {products.map(({ id, name, thumbnail, cost }) => {
                return (
                    <li key={id}>
                        <ProductListItem
                            id={id}
                            name={name}
                            thumbnail={thumbnail}
                            cost={cost}
                            onChange={onChange}
                        />
                    </li>
                )
            })}
        </ul>
    )
}

export default ProductList
