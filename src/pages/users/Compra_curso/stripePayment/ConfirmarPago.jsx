import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  Typography,
  useTheme,
} from "@material-ui/core";
import { useStripe } from "@stripe/react-stripe-js";
import MessageSnackbar from "../../../../components/Snackbar/snackbar";
import clienteAxios from "../../../../config/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCcVisa, faCcMastercard } from "@fortawesome/free-brands-svg-icons";
import { CtxPrincipal } from "../../../../context/ContextPrincipal";
import CrearIntentoPago from "./CrearIntentoPago";

export default function ConfirmarPago({ compra, total }) {
  const theme = useTheme();
  const token = localStorage.getItem("token");
  const [idPago, setIdPago] = useState("");
  const [card, setCard] = useState({});
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [open, setOpen] = useState(false);
  const [loadingPago, setLoadingPago] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
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
      .put(
        `/pay/confirm/${idPago}`,
        {
          idPay: idPago,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoadingPago(false);
        if (res.data.message === "requires_action") {
          setOpen(true);
          const PAYMENT_INTENT = res.data.paymentConfirm;
          setPaymentIntent(PAYMENT_INTENT);
          const container = document.getElementById("contenedor-pago");
          var iframe = document.createElement("iframe");
          iframe.src = PAYMENT_INTENT.next_action.redirect_to_url.url;
          iframe.width = 600;
          iframe.height = 600;
          container.appendChild(iframe);
        } else {
          window.location.href = `/payment_success/${idPago}`;
        }
      })
      .catch((err) => {
        setLoadingPago(false);
        if (err.response) {
          window.location.href = `/payment_failed/${idPago}/${err.response.data.message}`;
        } else {
          window.location.href = `/payment_failed/${idPago}/Al parecer no se a podido conectar al servidor`;
        }
      });
  };

  const cancelarPago = async () => {
    setLoadingCancel(true);
    await clienteAxios
      .post(
        `/pay/cancel/${idPago}`,
        {},
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
        setTimeout(() => {
          window.location.href = "/";
          setPayment(null);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        setSnackbar({
          open: true,
          mensaje: err.message,
          status: "error",
        });
      });
  };

  const createInscription = async () => {
    setLoadingPago(true);
    await clienteAxios
      .post(
        `/pay/confirm/createInscription`,
        {
          idPaymentIntent: paymentIntent.id,
          idPay: idPago,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoadingPago(false);
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
        setTimeout(() => {
          window.location.href = `/payment_success/${idPago}`;
        }, 1000);
      })
      .catch((err) => {
        setLoadingPago(false);
        console.log(err.response);
        setSnackbar({
          open: true,
          mensaje: err.message,
          status: "error",
        });
      });
  };

  function on3DSComplete() {
    if (paymentIntent) {
      // Hide the 3DS UI
      const container = document.getElementById("contenedor-pago");
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
              createInscription();
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
        <Box id="contenedor-pago" height={"100%"} width={600} />
      </Dialog>
      {idPago ? (
        <Box>
          <Box my={4}>
            <Box my={1}>
              <Typography>
                <b>Se aplicará el cargo a esta tarjeta:</b>
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item>
                <FontAwesomeIcon
                  icon={card.brand === "visa" ? faCcVisa : faCcMastercard}
                  style={{
                    fontSize: "50px",
                    color: theme.palette.primary.main,
                  }}
                />
              </Grid>
              <Grid item>
                <Typography>
                  <b>Tipo de tarjeta: </b>
                  {card.funding}
                </Typography>
                <Typography>
                  <b>Tarjeta: </b>*********{card.last4}
                </Typography>
                <Typography>
                  <b>Expira: </b>
                  {card.exp_month}/{card.exp_year}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box my={1}>
            <Button
              fullWidth
              color="primary"
              size="large"
              variant="contained"
              startIcon={
                loadingPago ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null
              }
              onClick={() => realizarPago()}
            >
              Realizar Pago
            </Button>
          </Box>
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
              Cancelar
            </Button>
          </Box>
        </Box>
      ) : (
        <CrearIntentoPago
          compra={compra}
          total={total}
          setIdPago={setIdPago}
          setCard={setCard}
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
