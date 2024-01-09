import React, { Fragment } from 'react';
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import { Button, Grid } from '@material-ui/core';
import ExcelFile from "react-export-excel/dist/ExcelPlugin/components/ExcelFile";
import ExcelSheet from "react-export-excel/dist/ExcelPlugin/elements/ExcelSheet";
import ExcelColumn from "react-export-excel/dist/ExcelPlugin/elements/ExcelColumn";
import moment from 'moment'

export default function ExportExcelAnswersUsers({users}) {
  const data = users.map((user) => {
    return {
      name: user.nameUser,
      email: user.emailUser,
      phone: user.phoneUser ? user.phoneUser : "-",
      curso: user.nameCurso,
      pregunta: user.textQuestion,
      respuesta: user.answer,
      fecha: moment(user.createdAt).format("DD/MM/YYYY"),
    };
  });

  return (
    <Fragment>
      <Grid item>
        <ExcelFile
          element={
            <Button
              size="large"
              color="primary"
              variant="contained"
              startIcon={<DescriptionOutlinedIcon />}
            >
              Exportar
            </Button>
          }
          filename={`Estudiantes`}
        >
          <ExcelSheet data={data} name="Datos de los instructores">
            <ExcelColumn label="Nombre" value="name" />
            <ExcelColumn label="Email" value="email" />
            <ExcelColumn label="Telefono" value="phone" />
            <ExcelColumn label="Curso" value="curso" />
            <ExcelColumn label="Pregunta" value="pregunta" />
            <ExcelColumn label="Respuesta" value="respuesta" />
            <ExcelColumn label="Fecha de registro" value="fecha" />
          </ExcelSheet>
        </ExcelFile>
      </Grid>
    </Fragment>
  )
}
