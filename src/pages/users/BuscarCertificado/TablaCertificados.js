import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { formatoFechaCurso } from "../../../config/reuserFunction";
import { Box, Typography } from "@material-ui/core";
import { School } from "@material-ui/icons";

export default function TablaCertificados({ certificado, loaded }) {
  if(!loaded && !certificado) return null

  if (loaded && !certificado) {
    return (
      <Box my={10} display="flex" justifyContent="center">
        <Box textAlign="center">
          <School color="disabled" style={{ fontSize: 120 }} />
          <Box my={1} />
          <Typography color="textSecondary" align="center" variant="h5">
            No se encontro ningun certificado
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No. Certificado</TableCell>
              <TableCell>Estudiante</TableCell>
              <TableCell>Curso</TableCell>
              <TableCell>Fecha de emisión:</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{certificado.certificate_number}</TableCell>
              <TableCell>{certificado.user}</TableCell>
              <TableCell>{certificado.course}</TableCell>
              <TableCell>
                {certificado.finish_date
                  ? formatoFechaCurso(certificado.finish_date)
                  : ""}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
