import React, { Fragment, useState } from "react";
import { Box, Button, CircularProgress, useTheme } from "@material-ui/core";
import { CardElement } from "@stripe/react-stripe-js";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import MessageSnackbar from "../../../../../components/Snackbar/snackbar";
import clienteAxios from "../../../../../config/axios";
import { Close, VerifiedUser } from "@material-ui/icons";
import { ConsultaContext } from "../../Context";

export default function CrearIntentoPago({
  setIdPago,
  setCard,
  setTypePayment,
}) {
  const theme = useTheme();
  const elements = useElements();
  const stripe = useStripe();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const { appointment } = React.useContext(ConsultaContext);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
      base: {
        border: "1px solid #ccc",
        iconColor: theme.palette.action.disabled,
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

  const handleSubmit = async () => {
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
      setLoading(false);
      setSnackbar({
        open: true,
        mensaje: error.message,
        status: "error",
      });
    } else {
      const datos = {
        idStripe: paymentMethod,
        username: appointment.name,
        total: appointment.amount,
        typePay: "stripe",
        isService: true,
        idService: appointment.idProduct,
        summary: appointment.summary,
      };
      crearPagoBD(datos);
    }
  };

  const crearPagoBD = async (datos) => {
    await clienteAxios
      .post(`/appointment/payment/payment_intent`, datos, {
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

  return (
    <Fragment>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <CardElement
        options={CARD_OPTIONS}
      />
      <Box my={2} />
      <Button
        color="secondary"
        fullWidth
        variant="contained"
        disableElevation
        style={{ textTransform: "none" }}
        onClick={handleSubmit}
        disabled={!stripe}
        startIcon={
          loading ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            <VerifiedUser />
          )
        }
      >
        Verificar tarjeta
      </Button>
      <Box my={1} />
      <Button
        fullWidth
        disableElevation
        style={{ textTransform: "none" }}
        onClick={() => setTypePayment("")}
        startIcon={<Close />}
      >
        Cancelar
      </Button>
    </Fragment>
  );
}
