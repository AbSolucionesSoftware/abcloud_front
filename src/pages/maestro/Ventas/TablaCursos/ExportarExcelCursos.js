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

export default function ExportarExcelCursos() {
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
      .get(`/sales/export/courses/${user._id}?value=${valor}`, {
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
  const inscriptions = data.map((curso) => {
    const { createdAt, idUser, idCourse, payment } = curso;

    const cupon =
      curso.coupon_discount && curso.coupon_discount.coupon_code
        ? `${curso.coupon_discount.coupon_code}  -${curso.coupon_discount.percent_discount}%`
        : "-";
    const descuento = idCourse.priceCourse.promotionPrice
      ? formatoMexico(idCourse.priceCourse.promotionPrice)
      : formatoMexico(idCourse.priceCourse.price);

    const inscriptionsList = {
      fecha: moment(createdAt).format("DD/MM/YYYY"),
      curso: idCourse.title,
      estudiante: idUser.name,
      tipo: payment.typePay,
      descuento,
      cupon,
      precio: idCourse.priceCourse.promotionPrice
        ? `$${formatoMexico(idCourse.priceCourse.promotionPrice)}`
        : `$${formatoMexico(idCourse.priceCourse.price)}`,
      monto: `$${formatoMexico(payment.total)}`,
    };

    return inscriptionsList;
  });
  return (
    <ExcelFile
      element={
        <Button color="primary" startIcon={<CloudDownloadIcon />}>
          Exportar
        </Button>
      }
      filename={`inscripciones PAGADAS uniline de hace ${value} semana`}
    >
      <ExcelSheet
        data={inscriptions}
        name={`inscripciones PAGADAS uniline de hace ${value} semana`}
      >
        <ExcelColumn label="Fecha" value="fecha" />
        <ExcelColumn label="Curso" value="curso" />
        <ExcelColumn label="Estudiante" value="estudiante" />
        <ExcelColumn label="Tipo de pago" value="tipo" />
        <ExcelColumn label="Descuento" value="descuento" />
        <ExcelColumn label="Cupón" value="cupon" />
        <ExcelColumn label="Precio curso" value="precio" />
        <ExcelColumn label="Monto" value="monto" />
      </ExcelSheet>
    </ExcelFile>
  );
};
