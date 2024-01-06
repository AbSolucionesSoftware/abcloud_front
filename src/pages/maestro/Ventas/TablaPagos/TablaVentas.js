import React, { useCallback, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import { formatoMexico } from "../../../../config/reuserFunction";
import moment from "moment";
import { Box, TablePagination, Typography } from "@material-ui/core";
import DetallePagoModal from "./DetallePago";
import clienteAxios from "../../../../config/axios";
import FiltrosVentasMaestro from "./FiltroVentas";
import { CheckCircleTwoTone, ErrorTwoTone } from "@material-ui/icons";

const useStyles = makeStyles({
  table: {
    height: "40vh",
  },
});

export default function TablaVentasMaestro({ setSnackbar }) {
  const classes = useStyles();
  let user = JSON.parse(localStorage.getItem("student"));
  let token = localStorage.getItem("token");
  const [loadingList, setLoadingList] = useState(false);
  const [ventasDocs, setVentasDocs] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [filtro, setFiltro] = useState({ field: "", search: "" });

  let idUser = user || user !== null ? user._id : "";

  const getSalesDB = useCallback(
    async (page = 1) => {
      setLoadingList(true);
      await clienteAxios
        .get(
          `/sales/${idUser}?page=${page}&limit=20&field=${filtro.field}&search=${filtro.search}`,
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          setLoadingList(false);
          setVentasDocs(res.data.docs);
          setVentas(res.data);
        })
        .catch((err) => {
          setLoadingList(false);
          console.log(err.response);
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
    [token, idUser, setSnackbar, filtro.field, filtro.search]
  );

  useEffect(() => {
    getSalesDB();
  }, [getSalesDB]);

  if (loadingList) {
    return (
      <Box
        height="20vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  const handleChangePage = (e, page) => {
    let nextPage = page + 1;
    getSalesDB(nextPage);
  };

  return (
    <Box>
      <Box mt={2} mb={1}>
        <FiltrosVentasMaestro filtro={filtro} setFiltro={setFiltro} />
      </Box>
      <TableContainer component={Paper} className={classes.table}>
        <Table size="small" stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width={100}>Fecha</TableCell>
              <TableCell width={260}>Nombre comprador</TableCell>
              <TableCell width={150}>Método de pago</TableCell>
              <TableCell width={150}>Estado de pago</TableCell>
              <TableCell width={160}>Servicio adquirido</TableCell>
              <TableCell>Total</TableCell>
              <TableCell align="right">Más detalles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventasDocs.map((sale, index) => (
              <TableRow key={index}>
                <TableCell>
                  {moment(sale.createdAt).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>{sale.nameUser}</TableCell>
                <TableCell>{sale.typePay}</TableCell>
                <TableCell>
                  <span style={{display: "flex"}}>
                    {sale.statusPay ? (
                      <CheckCircleTwoTone htmlColor="green" style={{fontSize: 20}} />
                    ) : (
                      <ErrorTwoTone color="error" style={{fontSize: 20}} />
                    )}
                    <Typography variant="body2" style={{marginLeft: 6}}>{sale.comment}</Typography>
                  </span>
                </TableCell>
                <TableCell>{sale.typeService ? sale.typeService : "Curso"}</TableCell>
                <TableCell>$ {formatoMexico(sale.total)}</TableCell>
                <TableCell align="right">
                  <DetallePagoModal sale={sale} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[0]}
        component="div"
        count={ventas.totalDocs}
        rowsPerPage={20}
        page={ventas.page - 1}
        onChangePage={handleChangePage}
      />
    </Box>
  );
}
