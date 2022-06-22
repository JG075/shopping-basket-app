import Image from "next/image"
import { FC } from "react"
import Paper from "@mui/material/Paper"
import { Button } from "@mui/material"

import { currency } from "../../utils/currency"

interface Props {
    id: number
    name: string
    thumbnail: string
    cost: number
    discounts?: string[]
    onChange: (id: number, qty: number) => void
}

const ProductListItem: FC<Props> = ({
    id,
    name,
    thumbnail,
    cost,
    discounts,
    onChange,
}: Props) => {
    return (
        <Paper
            sx={{
                width: "100%",
                padding: "20px 20px",
            }}
            elevation={2}
        >
            <div
                css={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Image src={thumbnail} alt={name} height={100} width={100} />
                <span>{name}</span>
                <span>{currency(cost).format()}</span>
                <div
                    css={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Button onClick={() => onChange(id, 1)}>Add to cart</Button>
                    <Button onClick={() => onChange(id, -1)} color="error">
                        Remove item
                    </Button>
                </div>
            </div>
            {discounts &&
                discounts.map((d) => (
                    <div
                        css={{
                            fontSize: 14,
                            textAlign: "right",
                        }}
                        key={d}
                    >
                        <i>Special offer: {d}</i>
                    </div>
                ))}
        </Paper>
    )
}

export default ProductListItem
