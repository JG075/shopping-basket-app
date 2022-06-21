import { FC } from "react"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableFooter from "@mui/material/TableFooter"
import Paper from "@mui/material/Paper"

interface Props {
    items: {
        id: number
        qty: number
        name: string
        cost: number
    }[]
}

const ShoppingBasket: FC<Props> = ({ items }: Props) => {
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
                    {items.map(({ id, qty, name, cost }) => {
                        return (
                            <TableRow key={id}>
                                <TableCell>
                                    {qty} {name}
                                </TableCell>
                                <TableCell align="right">{cost}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total to pay:</TableCell>
                        <TableCell align="right">£x</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

export default ShoppingBasket
