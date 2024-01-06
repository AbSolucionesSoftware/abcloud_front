import React, { Fragment, useState } from "react";
import { Box, Button, CircularProgress, useTheme } from "@material-ui/core";
import { CardElement } from "@stripe/react-stripe-js";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import MessageSnackbar from "../../../../components/Snackbar/snackbar";
import clienteAxios from "../../../../config/axios";
import { CtxPrincipal } from "../../../../context/ContextPrincipal";

export default function CrearIntentoPago({ compra, total, setIdPago, setCard }) {
  const theme = useTheme();
  const elements = useElements();
  const stripe = useStripe();
  const token = localStorage.getItem("token");
  const { setPayment } = React.useContext(CtxPrincipal);

  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
      base: {
        iconColor: theme.palette.primary.main,
        color: theme.palette.text.primary,
        fontWeight: 400,
        fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        fontSize: "16px",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": { color: theme.palette.text.primary },
        "::placeholder": { color: theme.palette.text.hint },
      },
      invalid: {
        iconColor: theme.palette.error.main,
        color: theme.palette.error.main,
      },
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setLoading(true);
    const cardElement = elements.getElement(CardElement);

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log(error);
      setLoading(false);
      setSnackbar({
        open: true,
        mensaje: error.message,
        status: "error",
      });
    } else {
      const datos = {
        idStripe: paymentMethod,
        courses: compra.courses,
        username: compra.user.name,
        idUser: compra.user._id,
        total: total,
        typePay: "stripe",
      };
      crearPagoBD(datos);
    }
  };

  const crearPagoBD = async (datos) => {
    await clienteAxios
      .post(`/pay/generate`, datos, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setIdPago(res.data.idPay);
        setCard(datos.idStripe.card);
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

  const cancelarPago = async () => {
    setLoadingCancel(true);
    /* localStorage.removeItem("payment"); */
    setTimeout(() => {
      window.location.href = "/";
      setPayment(null);
    }, 1000);
  };

  return (
    <Fragment>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <form onSubmit={handleSubmit}>
        <Box my={4}>
          <CardElement options={CARD_OPTIONS} />
        </Box>
        <Button
          fullWidth
          color="primary"
          size="large"
          variant="contained"
          type="submit"
          disabled={!stripe}
          startIcon={
            loading ? <CircularProgress color="inherit" size={20} /> : null
          }
        >
          Comprobar tarjeta
        </Button>
        <Box my={1}>
          <Button
            fullWidth
            color="primary"
            size="large"
            variant="outlined"
            startIcon={
              loadingCancel ? (
                <CircularProgress color="inherit" size={20} />
              ) : null
            }
            onClick={() => cancelarPago()}
          >
            Cancelar compra
          </Button>
        </Box>
      </form>
    </Fragment>
  );
}
