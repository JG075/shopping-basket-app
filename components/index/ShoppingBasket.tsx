import { FC } from "react"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"

interface Props {}

const ShoppingBasket: FC<Props> = ({}: Props) => {
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
                    <TableRow>
                        <TableCell>Product...</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3}>Total to pay:</TableCell>
                        <TableCell align="right">£x</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ShoppingBasket
