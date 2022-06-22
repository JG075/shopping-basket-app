import { FC } from "react"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableFooter from "@mui/material/TableFooter"
import Paper from "@mui/material/Paper"
import { currency } from "../../utils/currency"

interface Props {
    items: {
        id: number
        qty: number
        name: string
        cost: number
        discount: number
    }[]
}

const ShoppingBasket: FC<Props> = ({ items }: Props) => {
    const getTotalItemCost = (qty: number, cost: number) => qty * cost

    const grandTotal = items.reduce((prev, { qty, cost, discount }) => {
        return prev + (getTotalItemCost(qty, cost) - discount)
    }, 0)

    return (
        <TableContainer component={Paper}>
            <Table aria-label="shopping basket">
                <TableHead>
                    <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell align="right">Unit Cost</TableCell>
                        <TableCell align="right">Total Cost</TableCell>
                        <TableCell align="right">Discount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(({ id, qty, name, cost, discount }) => {
                        return (
                            <TableRow key={id}>
                                <TableCell>
                                    {qty} {name}
                                </TableCell>
                                <TableCell align="right">
                                    {currency(cost).format()}
                                </TableCell>
                                <TableCell align="right">
                                    {currency(
                                        getTotalItemCost(qty, cost)
                                    ).format()}
                                </TableCell>
                                <TableCell align="right">
                                    {currency(discount).format()}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                <TableFooter
                    sx={{
                        td: {
                            fontSize: "0.875rem",
                            fontWeight: "bold",
                        },
                    }}
                >
                    <TableRow>
                        <TableCell colSpan={3}>Total to pay:</TableCell>
                        <TableCell align="right">
                            {currency(grandTotal).format()}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

export default ShoppingBasket
