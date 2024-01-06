import { Box, Button } from "@material-ui/core";
import React, { Fragment } from "react";
import AssignmentReturnedIcon from '@material-ui/icons/AssignmentReturned';

import ReactExport from "react-export-excel"; //LIBRERIA EXCEL
const ExcelFile = ReactExport.ExcelFile; //ARCHIVO DE EXCEL
const ExcelSheet = ReactExport.ExcelSheet; //HOJA DE EXCEL
const ExcelColumn = ReactExport.ExcelColumn; //COLUMNA DE EXCEL

export default function ConsutaExcel({ usuarios }) {
  const datos = usuarios?.map((datos) => {
    const clientes = {};

    clientes.nameUser = datos.nameUser;
    clientes.emailUser = datos.emailUser;
    clientes.phoneUser = datos.phoneUser;

    return clientes;
  });

  return (
    <Fragment>
      <Box justify="center">
        <ExcelFile
          element={
            <Box p={2}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                startIcon={<AssignmentReturnedIcon />}
              >
                Lista en Excel
              </Button>
            </Box>
          }
          filename="Datos Registros"
        >
          <ExcelSheet data={datos} name="Datos Registros de usuarios">
            <ExcelColumn label="Nombre usuario" value="nameUser" />
            <ExcelColumn label="Correo electronico" value="emailUser" />
			<ExcelColumn label="Telefono" value="phoneUser" />
          </ExcelSheet>
        </ExcelFile>
      </Box>
    </Fragment>
  );
}
