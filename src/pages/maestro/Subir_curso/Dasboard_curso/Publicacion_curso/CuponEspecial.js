import React, { useContext, useState } from "react";
import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import { Delete, Done } from "@material-ui/icons";
import { CursoContext } from "../../../../../context/curso_context";
import Spin from "../../../../../components/Spin/spin";
import MessageSnackbar from "../../../../../components/Snackbar/snackbar";
import clienteAxios from "../../../../../config/axios";
import { Typography } from "@material-ui/core";
import TablaCuponesDescuento from "./TablaCuponesDescuento";

export default function CuponEspecial() {
  const { datos, setDatos, update, setUpdate } = useContext(CursoContext);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  const handleChangeActive = (active_coupon) => {
    setDatos({
      ...datos,
      active_coupon,
    });
  };

  const handleChangeCode = (coupon_code) => {
    setDatos({
      ...datos,
      coupon_discount: {
        ...datos.coupon_discount,
        coupon_code,
      },
    });
  };

  function obtenerPorcentaje(percent_discount) {
    //obtiene el valor de descuento
    let precio = datos.priceCourse.promotionPrice ? datos.priceCourse.promotionPrice : datos.priceCourse.price
    let porcentaje = 100 - percent_discount;
    let descuento = Math.round((precio * porcentaje) / 100);
    setDatos({
      ...datos,
      coupon_discount: {
        ...datos.coupon_discount,
        discount_price: descuento,
        percent_discount,
      },
    });
  }

  const obtenerPrecioPromocion = (discount_price) => {
    //obtiene el porcentaje
    let precio = datos.priceCourse.promotionPrice ? datos.priceCourse.promotionPrice : datos.priceCourse.price
    let percent = Math.round((discount_price / precio) * 100);
    let porcentaje = 100 - percent;
    setDatos({
      ...datos,
      coupon_discount: {
        ...datos.coupon_discount,
        discount_price,
        percent_discount: porcentaje,
      },
    });
  };

  const guardarCuponDescuentoBD = async () => {
    if (!datos.coupon_discount.coupon_code) {
      setError(true);
      return;
    }

    setLoading(true);
    let data = {
      active_coupon: datos.active_coupon,
      coupon_discount: {
        percent_discount: parseFloat(datos.coupon_discount.percent_discount),
        discount_price: parseFloat(datos.coupon_discount.discount_price),
        coupon_code: datos.coupon_discount.coupon_code.toUpperCase(),
      },
    };
    await clienteAxios
      .put(`/course/coupon-promotion/${datos._id}`, data, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
        setUpdate(!update);
        setError(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setSnackbar({
            open: true,
            mensaje: err.response.data.message,
            status: "error",
          });
        } else {
          setSnackbar({
            open: true,
            mensaje: "Al parecer no se a podido conectar al servidor.",
            status: "error",
          });
        }
      });
  };

  const eliminarCuponDescuentoBD = async () => {
    setLoading(true);
    await clienteAxios
      .put(
        `/course/coupon-promotion/delete/${datos._id}`,
        {},
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
        setUpdate(!update);
        setError(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setSnackbar({
            open: true,
            mensaje: err.response.data.message,
            status: "error",
          });
        } else {
          setSnackbar({
            open: true,
            mensaje: "Al parecer no se a podido conectar al servidor.",
            status: "error",
          });
        }
      });
  };

  return (
    <Box my={4}>
      <Spin loading={loading} />
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Grid container spacing={2}>
        <Grid item md={2} xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={datos.active_coupon}
                onChange={(e) => handleChangeActive(e.target.checked)}
                name="active_coupon"
                color="primary"
              />
            }
            label={datos.active_coupon ? "Activo" : "Inactivo"}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            label="Código"
            variant="outlined"
            onChange={(e) => handleChangeCode(e.target.value)}
            size="small"
            fullWidth
            value={
              datos.coupon_discount ? datos.coupon_discount.coupon_code : ""
            }
            inputProps={{ style: { textTransform: "uppercase" } }}
            error={error && !datos.coupon_discount.coupon_code}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <TextField
            label="Porcentaje"
            variant="outlined"
            onChange={(e) => obtenerPorcentaje(e.target.value)}
            size="small"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">%</InputAdornment>
              ),
            }}
            value={
              datos.coupon_discount ? datos.coupon_discount.percent_discount : 0
            }
            error={error && !datos.coupon_discount.percent_discount}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <TextField
            label="Precio con descuento"
            variant="outlined"
            onChange={(e) => obtenerPrecioPromocion(e.target.value)}
            size="small"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            value={
              datos.coupon_discount ? datos.coupon_discount.discount_price : 0
            }
            error={error && !datos.coupon_discount.discount_price}
          />
        </Grid>
      </Grid>
      <Box my={2}>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Done />}
              onClick={() => guardarCuponDescuentoBD()}
            >
              Guardar
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Delete />}
              onClick={() => eliminarCuponDescuentoBD()}
            >
              Eliminar
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Typography>Cupones Aplicados</Typography>
        <TablaCuponesDescuento />
      </Box>
    </Box>
  );
}
