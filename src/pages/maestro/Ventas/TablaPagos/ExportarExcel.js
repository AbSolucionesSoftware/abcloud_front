import React, { Fragment } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { formatoMexico } from "../../../../config/reuserFunction";
import moment from "moment";

import ReactExport from "react-export-excel";
import clienteAxios from "../../../../config/axios";
import { CircularProgress, InputAdornment } from "@material-ui/core";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ModalExportPayments() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [data, setData] = React.useState([]);
  let user = JSON.parse(localStorage.getItem("student"));
  let token = localStorage.getItem("token");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const obtenerConsulta = async (valor) => {
    setLoading(true);
    await clienteAxios
      .get(`/sales/export/${user._id}?value=${valor}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setData(res.data);
        setValue(valor);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.response);
      });
  };

  return (
    <Fragment>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handleClickOpen()}
        startIcon={<CloudDownloadIcon />}
      >
        Exportar
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <FormControl variant="outlined" style={{ width: "200px" }}>
            <InputLabel id="select-week">Exportar desde..</InputLabel>
            <Select
              labelId="select-week"
              value={value}
              onChange={(e) => obtenerConsulta(e.target.value)}
              label="Exportar desde..."
              startAdornment={
                <InputAdornment position="start">
                  {loading ? <CircularProgress size={20} /> : <div />}
                </InputAdornment>
              }
            >
              <MenuItem value={0}>Seleciona una</MenuItem>
              <MenuItem value={1}>Hace 1 semana</MenuItem>
              <MenuItem value={2}>Hace 2 semanas</MenuItem>
              <MenuItem value={3}>Hace 3 semanas</MenuItem>
              <MenuItem value={4}>Hace 4 semanas</MenuItem>
              <MenuItem value={""}>Exportar todo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cerrar
          </Button>
          <ExportarPagos data={data} value={value} />
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

const ExportarPagos = ({ data, value }) => {
  const payments = data.map((payment) => {
    const { createdAt, nameUser, typePay, statusPay, total, courses } = payment;
    let cursos = [];
    for (let i = 0; i < courses.length; i++) {
      const curso = value === "" ? courses[i].idCourse : courses[i];
      cursos.push(curso.title);
    }
    let cursosString = JSON.stringify(cursos);
    cursosString = cursosString.replace("[", "").replace("]", "");

    const paymentsList = {
      fecha: moment(createdAt).format("DD/MM/YYYY"),
      estudiante: nameUser,
      tipo: typePay,
      estado: statusPay ? "OK" : "ERROR",
      comment: payment.comment,
      total: `$${total ? formatoMexico(total) : 0}`,
      cursos: cursosString,
    };

    return paymentsList;
  });
  return (
    <ExcelFile
      element={
        <Button color="primary" startIcon={<CloudDownloadIcon />}>
          Exportar
        </Button>
      }
      filename={`Ventas de hace ${value} semana`}
    >
      <ExcelSheet
        data={payments}
        name={`Ventas de hace ${value} semana`}
      >
        <ExcelColumn label="Fecha" value="fecha" />
        <ExcelColumn label="Estudiante" value="estudiante" />
        <ExcelColumn label="Tipo de pago" value="tipo" />
        <ExcelColumn label="Estado del pago" value="estado" />
        <ExcelColumn label="Detalle del estado" value="comment" />
        <ExcelColumn label="Total" value="total" />
        <ExcelColumn label="Cursos comprados" value="cursos" />
      </ExcelSheet>
    </ExcelFile>
  );
};
