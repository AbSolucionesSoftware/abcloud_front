import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { formatoMexico } from "../../../config/reuserFunction";
import EliminarProducto from "./EliminarProducto";
import NewProduct from "./NuevoProducto";

const useStyles = makeStyles({
  table: {
    height: "70vh",
  },
});

export default function TableProducts({ productos, setUpdate, setSnackbar }) {
  const classes = useStyles();

  return (
    <Paper variant="outlined" style={{ marginTop: "12px" }}>
      <TableContainer className={classes.table}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>descripción</TableCell>
              <TableCell>tipo</TableCell>
              <TableCell>precio</TableCell>
              <TableCell padding="checkbox" />
              <TableCell padding="checkbox" />
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>${formatoMexico(row.price)}</TableCell>
                <TableCell padding="checkbox">
                  <NewProduct
                    data={row}
                    setUpdate={setUpdate}
                    setSnackbar={setSnackbar}
                  />
                </TableCell>
                <TableCell padding="checkbox">
                  <EliminarProducto
                    data={row}
                    setUpdate={setUpdate}
                    setSnackbar={setSnackbar}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
