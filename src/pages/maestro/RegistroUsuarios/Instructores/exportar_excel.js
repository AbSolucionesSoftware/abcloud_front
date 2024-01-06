import React, { Fragment } from "react";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import ExcelFile from "react-export-excel/dist/ExcelPlugin/components/ExcelFile";
import ExcelSheet from "react-export-excel/dist/ExcelPlugin/elements/ExcelSheet";
import ExcelColumn from "react-export-excel/dist/ExcelPlugin/elements/ExcelColumn";
import { withRouter } from "react-router-dom";
import { Grid, Button } from "@material-ui/core";

function ExportarExcelMaestros({ maestros }) {
  const data = maestros.map((data) => {
    const instructor = {
      name: "",
      email: "",
      phone: "",
      scholarship: "",
    };

    instructor.name = data.teacher.name;
    instructor.email = data.teacher.email;
    instructor.phone = data.teacher.phone;
    instructor.courses = data.courses;
    return instructor;
  });

  return (
    <Fragment>
      <Grid>
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
            filename={`instructores de UNILINE`}
          >
            <ExcelSheet data={data} name="Datos de los instructores">
              <ExcelColumn label="Nombre" value="name" />
              <ExcelColumn label="Email" value="email" />
              <ExcelColumn label="Telefono" value="phone" />
              <ExcelColumn label="Cursos impartidos" value="courses" />
            </ExcelSheet>
          </ExcelFile>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default withRouter(ExportarExcelMaestros);
