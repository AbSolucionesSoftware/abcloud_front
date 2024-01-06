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
import { Box, TablePagination } from "@material-ui/core";
import clienteAxios from "../../../../config/axios";
import FiltrosVentasMaestro from "./FiltroCursos";

const useStyles = makeStyles({
  table: {
    height: "40vh",
  },
});

export default function TablaVentasCursos({ setSnackbar }) {
  const classes = useStyles();
  let user = JSON.parse(localStorage.getItem("student"));
  let token = localStorage.getItem("token");
  const [loadingList, setLoadingList] = useState(false);
  const [cursosDocs, setCursoDocs] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [filtro, setFiltro] = useState("");

  let idUser = user || user !== null ? user._id : "";

  const getSalesDB = useCallback(
    async (page = 1) => {
      setLoadingList(true);
      await clienteAxios
        .get(
          `/sales/${idUser}/courses?page=${page}&limit=20&filter=${filtro}`,
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setLoadingList(false);
          setCursoDocs(res.data.docs);
          setCursos(res.data);
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
    [token, idUser, setSnackbar, filtro]
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
              <TableCell>Fecha</TableCell>
              <TableCell>Curso</TableCell>
              <TableCell>Estudiante</TableCell>
              <TableCell width={125}>Tipo de pago</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Cupón</TableCell>
              <TableCell>Precio Curso</TableCell>
              <TableCell>Monto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cursosDocs.map((curso, index) => (
              <TableRow key={index}>
                <TableCell>
                  {moment(curso.createdAt).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>{curso.idCourse.title}</TableCell>
                <TableCell>{curso.idUser.name}</TableCell>
                <TableCell>{curso.payment.typePay}</TableCell>
                <TableCell>
                  {curso.idCourse.priceCourse.promotionPrice
                    ? `-${curso.idCourse.priceCourse.persentagePromotion}%`
                    : "-"}
                </TableCell>
                <TableCell>
                  {curso.coupon_discount && curso.coupon_discount.coupon_code
                    ? `${curso.coupon_discount.coupon_code}  -${curso.coupon_discount.percent_discount}%`
                    : "-"}
                </TableCell>
                <TableCell>
                  ${" "}
                  {curso.idCourse.priceCourse.promotionPrice
                    ? formatoMexico(curso.idCourse.priceCourse.promotionPrice)
                    : formatoMexico(curso.idCourse.priceCourse.price)}
                </TableCell>
                <TableCell>$ {formatoMexico(curso.payment.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[0]}
        component="div"
        count={cursos.totalDocs}
        rowsPerPage={20}
        page={cursos.page - 1}
        onChangePage={handleChangePage}
      />
    </Box>
  );
}
