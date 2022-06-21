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
    onChange: (id: number, qty: number) => void
}

const ProductListItem: FC<Props> = ({
    id,
    name,
    thumbnail,
    cost,
    onChange,
}: Props) => {
    return (
        <Paper
            sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "10px 20px",
                justifyContent: "space-between",
            }}
            elevation={2}
        >
            <Image src={thumbnail} alt={name} height={100} width={100} />
            <span>{name}</span>
            <span>{currency(cost).format()}</span>
            <Button onClick={() => onChange(id, 1)}>Add to cart</Button>
        </Paper>
    )
}

export default ProductListItem
