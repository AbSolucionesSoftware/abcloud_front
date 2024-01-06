import React, { useState } from "react";
import {
  Box,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import ListaCompra from "./lista_items";
import { formatoMexico } from "../../../config/reuserFunction";
import ImagenMetodosPagoSinOxxo from "../../../images/metodosdepago_sinoxxo.png";
import PagoStripe from "./stripePayment/StripePayment";
import PagoPaypal from "./paypalPayment/PaypalPayment";
import { CtxPrincipal } from "../../../context/ContextPrincipal";

const useStyles = makeStyles((theme) => ({
  imagen: {
    width: "100%",
    height: "100%",
  },
  imagenContainer: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: theme.palette.background.paper,
    minHeight: "100vh"
  },
  grid: {
    backgroundColor: theme.palette.background.dafult,
  },
}));

export default function PagarCurso(props) {
  const classes = useStyles();
  const [value, setValue] = useState("credit");//credit
  let user = { _id: "" };
  let token = localStorage.getItem("token");
  const { payment } = React.useContext(CtxPrincipal);
  /* let compra = JSON.parse(localStorage.getItem("payment")); */

  if (!token || !user) props.history.push("/");
  if (token !== null) user = JSON.parse(localStorage.getItem("student"));

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  if (!payment) {
    window.location.href = "/";
  }

  const render_lista = payment.courses.map((curso, index) => (
    <ListaCompra key={index} curso={curso.course} curso_data={curso} />
  ));

  /* total de carrito */
  let total = 0;
  let totalAnterior = 0;
  let descuento = 0;
  let promocion = false;
  let items = [];
  payment.courses.forEach((articulo) => {
    if (articulo.course.priceCourse.free) {
      total += 0;
    } else {
      if (articulo.coupon_discount || articulo.both_promotion || articulo.pack) {
        total += articulo.pricePromotionCourse;
        promocion = true;
        items.push({
          sku: articulo.course._id,
          name: articulo.course.title,
          price: articulo.pricePromotionCourse.toFixed(2),
          quantity: 1,
          currency: "MXN",
        });
      } else if (articulo.course.priceCourse.promotionPrice) {
        total += articulo.course.priceCourse.promotionPrice;
        promocion = true;
        items.push({
          sku: articulo.course._id,
          name: articulo.course.title,
          price: articulo.course.priceCourse.promotionPrice.toFixed(2),
          quantity: 1,
          currency: "MXN",
        });
      } else {
        total += articulo.course.priceCourse.price;
        items.push({
          sku: articulo.course._id,
          name: articulo.course.title,
          price: articulo.course.priceCourse.price.toFixed(2),
          quantity: 1,
          currency: "MXN",
        });
      }
    }
    let precio = articulo.both_promotion
      ? articulo.course.priceCourse.promotionPrice
      : articulo.course.priceCourse.price;
    totalAnterior += precio;
    descuento = Math.trunc((((total * 100) / totalAnterior - 100) * -1));
  });

  const order = {
    customer: user.name,
    total: total.toFixed(2),
    items: items,
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Box>
        <Grid container spacing={2}>
          <Grid item md={8} xs={12}>
            <Box>{render_lista}</Box>
          </Grid>
          <Grid item md={4} xs={12}>
            <Box height="100%" p={4} className={classes.grid}>
              <Typography variant="h5">Total:</Typography>
              <Typography variant="h4">
                <b>{formatoMexico(total)} $MXN</b>
              </Typography>
              {promocion ? (
                <Grid container spacing={3}>
                  <Grid item>
                    <Typography variant="h6" color="textSecondary">
                      <s>{formatoMexico(totalAnterior)} $MXN</s>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" color="textSecondary">
                      {descuento}% de descuento
                    </Typography>
                  </Grid>
                </Grid>
              ) : null}
              <Box my={2}>
                <Divider />
              </Box>
              <Box my={2}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Métodos de pago</FormLabel>
                  <Box className={classes.imagenContainer}>
                    <img
                      alt="metodos de pago"
                      src={ImagenMetodosPagoSinOxxo}
                      className={classes.imagen}
                    />
                  </Box>
                  <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    value={value}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="credit"
                      control={<Radio color="primary" />}
                      label="Tarjeta de credito"
                    />
                    <FormControlLabel
                      value="paypal"
                      control={<Radio color="primary" />}
                      label="Paypal"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
              {value === "credit" ? (
                <PagoStripe compra={payment} total={total} />
              ) : (
                <PagoPaypal order={order} compra={payment} total={total} />
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
