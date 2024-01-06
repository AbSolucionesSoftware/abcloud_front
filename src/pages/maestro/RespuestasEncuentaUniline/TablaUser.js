import {
  Box,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React, { Fragment } from "react";
import Paper from "@material-ui/core/Paper";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  table: {
    height: "63vh",
  },
}));

export default function TablaUser({ users }) {
  const classes = useStyles();
  return (
    <Box>
      <TableContainer component={Paper} className={classes.table}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Curso</TableCell>
              <TableCell>Pregunta</TableCell>
              <TableCell>Respuesta</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users &&
              users.map((user, i) => <TableInfoBody key={i} user={user} />)}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

const TableInfoBody = ({ user }) => {
  return (
    <Fragment>
      <TableRow>
        <TableCell>{user?.nameUser}</TableCell>
        <TableCell>{user?.emailUser}</TableCell>
        <TableCell>{user?.phoneUser ? user?.phoneUser : "-"}</TableCell>
        <TableCell>{user?.nameCurso}</TableCell>
        <TableCell>{user?.textQuestion}</TableCell>
        <TableCell>{user?.answer}</TableCell>
        <TableCell>{moment(user?.createdAt).format("DD/MM/YYYY")}</TableCell>
      </TableRow>
      {/* <Dialog
        //   open={open}
        //   onClose={handleClickModal}
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
        </Dialog> */}
    </Fragment>
  );
};
