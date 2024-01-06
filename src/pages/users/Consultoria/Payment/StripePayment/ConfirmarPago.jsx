import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Typography,
} from "@material-ui/core";
import { useStripe } from "@stripe/react-stripe-js";
import MessageSnackbar from "../../../../../components/Snackbar/snackbar";
import clienteAxios from "../../../../../config/axios";
import { CtxPrincipal } from "../../../../../context/ContextPrincipal";
import CrearIntentoPago from "./CrearIntentoPago";
import { Close, Done } from "@material-ui/icons";
import { ConsultaContext } from "../../Context";

export default function ConfirmarPago({ setTypePayment }) {
  const [idPago, setIdPago] = useState("");
  const [card, setCard] = useState({});
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [open, setOpen] = useState(false);
  const [loadingPago, setLoadingPago] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const { appointment, setPaymentStatus, handleNext } = React.useContext(
    ConsultaContext
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });
  const { setPayment } = React.useContext(CtxPrincipal);
  const stripe = useStripe();

  const realizarPago = async () => {
    setLoadingPago(true);
    await clienteAxios
      .post(`/appointment/payment/confirm/${idPago}`, {
        idPay: idPago,
        appointment,
      })
      .then((res) => {
        setLoadingPago(false);
        if (res.data.message === "requires_action") {
          setOpen(true);
          const PAYMENT_INTENT = res.data.paymentConfirm;
          setPaymentIntent(PAYMENT_INTENT);
          const container = document.getElementById("contenedor-pago-consulta");
          var iframe = document.createElement("iframe");
          iframe.src = PAYMENT_INTENT.next_action.redirect_to_url.url;
          iframe.width = 600;
          iframe.height = 600;
          container.appendChild(iframe);
        } else {
          setPaymentStatus({
            status: "success",
            data: {
              idPago,
              conferenceData: res.data.conferenceData,
              message:
                "Reunion Agendada: Verifica tu correo electrónico para ver los datos de la reunión",
            },
          });
          handleNext();
        }
      })
      .catch((err) => {
        setLoadingPago(false);
        if (err.response) {
          setPaymentStatus({
            status: "error",
            data: { idPago, message: err.response.data.message },
          });
        } else {
          setPaymentStatus({
            status: "error",
            data: {
              idPago,
              message:
                "Algo paso al intentar concretar el pago, verifica en tu cuenta de Stripe para verficar el error",
            },
          });
        }
      });
  };

  const cancelarPago = async () => {
    setLoadingCancel(true);
    await clienteAxios
      .post(`/appointment/payment/cancel/${idPago}`)
      .then((res) => {
        setLoadingCancel(false);
        setTypePayment("");
        setPayment(null);
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          mensaje: err.message,
          status: "error",
        });
      });
  };

  const createEventDB = async () => {
    setLoadingPago(true);
    await clienteAxios
      .post(`/appointment`, appointment)
      .then((res) => {
        setLoadingPago(false);
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
        setPaymentStatus({
          status: "success",
          data: {
            idPago,
            conferenceData: res.data.conferenceData,
            message:
              "Reunion Agendada: Verifica tu correo electrónico para ver los datos de la reunión",
          },
        });
        handleNext();
      })
      .catch((err) => {
        setLoadingPago(false);
        setPaymentStatus({
          status: "error",
          data: {
            idPago: "",
            message:
              "Se Realizo el pago pero ocurrió un error desconocido al crear reunión, por favor comunícate al soporte, lamentamos las molestias.",
          },
        });
      });
  };

  function on3DSComplete() {
    if (paymentIntent) {
      // Hide the 3DS UI
      const container = document.getElementById("contenedor-pago-consulta");
      container.remove();
      setOpen(false);

      // Check the PaymentIntent
      stripe
        .retrievePaymentIntent(paymentIntent.client_secret)
        .then(function (result) {
          if (result.error) {
            // PaymentIntent client secret was invalid
            setSnackbar({
              open: true,
              mensaje: "Invalid Key: PaymentIntent client secret was invalid",
              status: "error",
            });
          } else {
            if (result.paymentIntent.status === "succeeded") {
              // Show your customer that the payment has succeeded
              createEventDB();
            } else if (
              result.paymentIntent.status === "requires_payment_method"
            ) {
              // Authentication failed, prompt the customer to enter another payment method
              cancelarPago();
            }
          }
        });
    }
  }

  window.addEventListener(
    "message",
    function (ev) {
      if (ev.data === "3DS-authentication-complete") {
        on3DSComplete();
      }
    },
    false
  );

  return (
    <Box>
      <Dialog open={open}>
        <Box id="contenedor-pago-consulta" height={"100%"} width={600} />
      </Dialog>
      {idPago ? (
        <Box>
          <Typography>
            Tarjeta: <b>**** **** **** {card.last4} </b>
          </Typography>
          <Typography>
            Tipo de tarjeta: <b>{card.funding}</b>
          </Typography>
          <Typography>
            Expira:{" "}
            <b>
              {card.exp_month}/{card.exp_year}
            </b>
          </Typography>
          <Box my={2} />
          <Button
            fullWidth
            color="secondary"
            variant="contained"
            disableElevation
            style={{ textTransform: "none" }}
            startIcon={
              loadingPago ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <Done />
              )
            }
            onClick={() => realizarPago()}
          >
            Realizar Pago
          </Button>
          <Box my={1} />
          <Button
            fullWidth
            disableElevation
            style={{ textTransform: "none" }}
            startIcon={
              loadingCancel ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <Close />
              )
            }
            onClick={() => cancelarPago()}
          >
            Cancelar
          </Button>
        </Box>
      ) : (
        <CrearIntentoPago
          setIdPago={setIdPago}
          setCard={setCard}
          setTypePayment={setTypePayment}
        />
      )}
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
    </Box>
  );
}
