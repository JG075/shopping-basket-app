import Image from "next/image"
import { FC } from "react"
import Paper from "@mui/material/Paper"
import { Button } from "@mui/material"

interface Props {
    name: string
    thumbnail: string
    cost: string
}

const ProductListItem: FC<Props> = ({ name, thumbnail, cost }: Props) => {
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
            <span>{cost}</span>
            <Button>Add to cart</Button>
        </Paper>
    )
}

export default ProductListItem
