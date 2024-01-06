import React, { useCallback, useEffect, useState } from "react";
import ConsutaExcel from "./consutaExcel";
import {
  Box,
  Grid,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import MessageSnackbar from "../../../../../../components/Snackbar/snackbar";
import Spin from "../../../../../../components/Spin/spin";
import clienteAxios from "../../../../../../config/axios";
import Eliminar from "./eliminar_usuario";

const useStyles = makeStyles((theme) => ({
  color: {
    backgroundColor: theme.palette.background.paper,
  },
  select: {
    width: "100%",
    margin: "8px 0",
  },
  margin: {
    margin: theme.spacing(1),
  },
  iconSave: {
    zIndex: 10,
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(10),
  },
  editor: {
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      width: 320,
    },
  },
  container: {
    height: "45vh",
  },
}));

const columns = [
  { id: "nameUser", label: "Nombre" },
  { id: "emailUser", label: "Correo Electronico" },
  { id: "phoneUser", label: "Telefono" },
];

export default function AlumnosRegistrados({idcurso}) {
  /* const idcurso = props.match.params.curso; */
  const [upload, setUpload] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  const obtenerUsuarios = useCallback(async () => {
    await clienteAxios
      .get(`/taller/usersTaller/${idcurso}`)
      .then((res) => {
        setUsuarios(res.data);
        setUpload(false);
      })
      .catch((err) => {
        setUpload(false);
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
  }, [idcurso]);

  useEffect(() => {
    obtenerUsuarios();
  }, [upload, obtenerUsuarios]);

  return (
    <Box mt={1} pb={4} /* p={5} boxShadow={5} className={classes.color} */>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Spin loading={loading} />
      <Grid container spacing={2} alignItems="center">
        <Grid item md={8} xs={12}>
          <Typography variant="h6">Usuarios registrados al taller</Typography>
        </Grid>
        <Grid item md={4} xs={12}>
          <ConsutaExcel usuarios={usuarios} />
        </Grid>
      </Grid>
      <Box my={1} />
      <TableContainer className={classes.container}>
        <Table size="small" stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <Eliminar
                      usuario={row._id}
                      setUpload={setUpload}
                      upload={upload}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
