import React, { Fragment } from "react";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import { withRouter } from "react-router-dom";
import { Grid, Button } from "@material-ui/core";
import ExcelFile from "react-export-excel/dist/ExcelPlugin/components/ExcelFile";
import ExcelSheet from "react-export-excel/dist/ExcelPlugin/elements/ExcelSheet";
import ExcelColumn from "react-export-excel/dist/ExcelPlugin/elements/ExcelColumn";
import moment from "moment";

function ExportarExcelEstudiantes({ usuarios }) {
  const data = usuarios.map((data) => {
    const estudiante = {
      name: "",
      email: "",
      phone: "",
      scholarship: "",
    };

    estudiante.name = data.name;
    estudiante.email = data.email;
    estudiante.phone = data.phone;
    estudiante.registro = moment(data.createdAt).format("DD/MM/YYYY");
    return estudiante;
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
            filename={`Estudiantes de UNILINE`}
          >
            <ExcelSheet data={data} name="Datos de los instructores">
              <ExcelColumn label="Nombre" value="name" />
              <ExcelColumn label="Email" value="email" />
              <ExcelColumn label="Telefono" value="phone" />
              <ExcelColumn label="Fecha de registro" value="registro" />
            </ExcelSheet>
          </ExcelFile>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default withRouter(ExportarExcelEstudiantes);
