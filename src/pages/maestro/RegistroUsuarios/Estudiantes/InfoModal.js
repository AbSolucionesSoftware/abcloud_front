import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import moment from "moment";
import CustomAvatar from "../../../../components/CustomAvatar";

const useStyles = makeStyles((theme) => ({
  table: {
    height: "40vh",
  },
}));

export default function InformacionModalEstudiante({ user }) {
  const classes = useStyles();
  return (
    <Box>
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell align="left" />
              <TableCell>Nombre</TableCell>
              <TableCell>Correo electrónico</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Se registro el</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
              <TableCell>
                {moment(user.createdAt).format("DD/MM/YYYY")}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box my={2} display="flex" justifyContent="center">
        <Typography variant="h6">Cursos del estudiante</Typography>
      </Box>
      <TableContainer className={classes.table}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Curso</TableCell>
              <TableCell>Inscrito el</TableCell>
              <TableCell>Avance</TableCell>
              <TableCell>Concluido</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user.inscriptions.map((res, index) => (
              <CursosEstudiante key={index} curso={res} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

const CursosEstudiante = ({ curso }) => {
  return (
    <TableRow>
      <TableCell>
        <Box display="flex" justifyContent="center" alignItems="center">
          <img
            alt="imagen curso"
            src={curso.course[0].urlPromotionalImage}
            height="40"
            width="70"
          />
        </Box>
      </TableCell>
      <TableCell>{curso.course[0].title}</TableCell>
      <TableCell>{moment(curso.createdAt).format("DD/MM/YYYY")}</TableCell>
      <TableCell>{curso.studentAdvance}%</TableCell>
      <TableCell>{curso.ending ? "SI" : "NO"}</TableCell>
    </TableRow>
  );
};
