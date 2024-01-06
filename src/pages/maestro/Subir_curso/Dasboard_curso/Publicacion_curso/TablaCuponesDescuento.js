import React, { useCallback, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  Box,
  Grid,
  InputBase,
  TablePagination,
} from "@material-ui/core";
import Spin from "../../../../../components/Spin/spin";
import MessageSnackbar from "../../../../../components/Snackbar/snackbar";
import clienteAxios from "../../../../../config/axios";
import { CursoContext } from "../../../../../context/curso_context";
import { formatoFecha, formatoMexico } from "../../../../../config/reuserFunction";

const useStyles = makeStyles({
  table: {
    width: "100%",
  },
  root: {
    padding: "0px 4px",
    display: "flex",
    alignItems: "center",
  },
});

export default function TablaCuponesDescuento() {
  const classes = useStyles();
  const [busqueda, setBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cuponesBD, setCuponesBD] = useState([]);
  const { datos } = useContext(CursoContext);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const obtenerBusqueda = (e) => setBusqueda(e.target.value);

  const obtenerCuponesBD = useCallback(
    async () => {
      setLoading(true);
      await clienteAxios
        .get(`/course/inscription-with-coupon/${datos._id}`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          setCuponesBD(res.data);
          setPage(0);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response) {
            setSnackbar({
              open: true,
              mensaje: err.response.data.message,
              status: "error",
            });
          } else {
            setSnackbar({
              open: true,
              mensaje: "Al parecer no se a podido conectar al servidor.",
              status: "error",
            });
          }
        });
    },
    [datos._id, token]
  );

  useEffect(() => {
    obtenerCuponesBD();
  }, [obtenerCuponesBD]);

  useEffect(() => {
    setProductosFiltrados(
        cuponesBD.filter((datos) => {
        return datos.idUser.name.toLowerCase().includes(busqueda.toLowerCase());
      })
    );
  }, [busqueda, cuponesBD]);

  return (
    <Box>
      <Spin loading={loading} />
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Box>
        <Box my={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              <Paper
                variant="outlined"
                component="form"
                className={classes.root}
              >
                <InputBase
                  fullWidth
                  placeholder="Busca tu cupon"
                  inputProps={{ "aria-label": "busqueda por estudiante" }}
                  onChange={obtenerBusqueda}
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <TableContainer component={Paper}>
          <Table
            stickyHeader
            className={classes.table}
            aria-label="simple table"
          >
            <TableHead>
              <TableCell>Código</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Fecha</TableCell>
            </TableHead>
            <TableBody>
              {productosFiltrados
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.coupon_discount.coupon_code}</TableCell>
                    <TableCell>
                     ${row.coupon_discount.discount_price ? formatoMexico(row.coupon_discount.discount_price) : 0}
                    </TableCell>
                    <TableCell>
                      %{row.coupon_discount.percent_discount}
                    </TableCell>
                    <TableCell>{row.idUser.name}</TableCell>
                    <TableCell>{formatoFecha(row.createdAt)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={cuponesBD.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            `${to} de ${count !== -1 ? count : to}`
          }
        />
      </Box>
    </Box>
  );
}
