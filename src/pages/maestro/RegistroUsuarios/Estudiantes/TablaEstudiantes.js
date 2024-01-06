import React, { Fragment, useContext, useState } from "react";
import { IconButton, makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import InfoIcon from "@material-ui/icons/Info";
import { UsuariosDashCtx } from "../../../../context/usuariosAdminCtx";
import moment from "moment";
import InformacionModalEstudiante from "./InfoModal";
import CustomAvatar from "../../../../components/CustomAvatar";

const useStyles = makeStyles((theme) => ({
  table: {
    height: "63vh",
  },
}));

export default function TablaUsuariosEstudiantes() {
  const classes = useStyles();
  const { usuarios } = useContext(UsuariosDashCtx);

  return (
    <Box>
      <TableContainer component={Paper} className={classes.table}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell align="left" />
              <TableCell>Nombre</TableCell>
              <TableCell>Correo electrónico</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Se registro el</TableCell>
              <TableCell>Información</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((user, index) => (
              <TableInfoBody key={index} user={user} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

const TableInfoBody = ({ user }) => {
  const [open, setOpen] = useState(false);

  const handleClickModal = (e) => setOpen(!open);

  return (
    <Fragment>
      <TableRow>
        <TableCell align="left">
          {user.urlImage ? (
            <Avatar alt="imagen usuario" src={user.urlImage} />
          ) : (
            <CustomAvatar name={user.name} />
          )}
        </TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.phone ? user.phone : "-"}</TableCell>
        <TableCell>{moment(user.createdAt).format("DD/MM/YYYY")}</TableCell>
        <TableCell align="center">
          <IconButton size="small" color="default" onClick={handleClickModal}>
            <InfoIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <Dialog
        open={open}
        onClose={handleClickModal}
        aria-labelledby="detalles-student-modal"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="detalles-student-modal">{`Detalles de este estudiante`}</DialogTitle>
        <DialogContent>
          <InformacionModalEstudiante user={user} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClickModal()} color="primary" autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
