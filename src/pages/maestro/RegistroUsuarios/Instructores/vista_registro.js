import React, { Fragment, useContext, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Table,
} from "@material-ui/core";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import clienteAxios from "../../../../config/axios";
import ExportarExcelMaestros from "./exportar_excel";
import RegistrarInstructor from "./modal_registro_instructor";
import { UsuariosDashCtx } from "../../../../context/usuariosAdminCtx";

const useStyles = makeStyles((theme) => ({
  table: {
    [theme.breakpoints.only("xs")]: {
      display: "block",
      width: 320,
      overflowX: "auto",
    },
  },
}));

export default function VistaRegistroInstructores() {
  const classes = useStyles();
  const { reload, setReload, usuarios, maestros } = useContext(UsuariosDashCtx);

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Grid container spacing={1} justify="flex-end">
          <Grid item>
            <ExportarExcelMaestros maestros={maestros} />
          </Grid>
          <Grid item>
            <RegistrarInstructor
              usuarios={usuarios}
              reload={reload}
              setReload={setReload}
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Box className={classes.table}>
          <TableContainer component={Paper} style={{ height: "65vh" }}>
            <Table stickyHeader aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left" />
                  <TableCell>Nombre</TableCell>
                  <TableCell>Correo electrónico</TableCell>
                  <TableCell>Telefono</TableCell>
                  <TableCell align="right">Cursos impartidos</TableCell>
                  <TableCell align="right">Eliminar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {maestros.map((instructor, index) => (
                  <TableInfoBody key={index} instructor={instructor} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

const TableInfoBody = ({ instructor }) => {
  const teacher = instructor.teacher;
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const { reload, setReload, setLoading, setSnackbar } = useContext(
    UsuariosDashCtx
  );

  const handleClickModal = () => setOpen(!open);

  const eliminarMaestro = async (instructor) => {
    setLoading(true);
    await clienteAxios
      .put(
        `/user/${instructor}/teacher`,
        {
          type: "Estudiante",
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setReload(!reload);
        setSnackbar({
          open: true,
          mensaje: "Cambio realizado",
          status: "success",
        });
        handleClickModal();
      })
      .catch((err) => {
        setLoading(false);
        handleClickModal();
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
  };

  return (
    <Fragment>
      <TableRow>
        <TableCell align="left">
          <Avatar
            style={{ height: 32, width: 32 }}
            alt="imagen usuario"
            src={teacher.urlImage}
          />
        </TableCell>
        <TableCell>{teacher.name}</TableCell>
        <TableCell>{teacher.email}</TableCell>
        <TableCell>{teacher.phone ? teacher.phone : "-"}</TableCell>
        <TableCell align="center">{instructor.courses}</TableCell>
        <TableCell align="right">
          <IconButton
            size="small"
            aria-label="delete"
            onClick={() => handleClickModal()}
          >
            <DeleteIcon color="error" />
          </IconButton>
        </TableCell>
      </TableRow>
      <Dialog
        open={open}
        onClose={handleClickModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`¿Deseas quitar este instructor?`}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClickModal} color="primary">
            No, cancelar
          </Button>
          <Button
            onClick={() => eliminarMaestro(teacher._id)}
            color="primary"
            autoFocus
          >
            Si, aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
