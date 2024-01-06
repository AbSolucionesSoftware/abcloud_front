import React, { useState } from "react";
import ReactDOM from "react-dom";
import Paypal from "paypal-checkout";
import { Box } from "@material-ui/core";
import MessageSnackbar from "../../../../../components/Snackbar/snackbar";
import clienteAxios from "../../../../../config/axios";
import { ConsultaContext } from "../../Context";

export default function PaypalPayment({ typePayment }) {
  const { appointment, handleNext, setPaymentStatus } = React.useContext(
    ConsultaContext
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });
  const paypalConfig = {
    currency: "MXN",
    env: "production", //sandbox o production
    client: {
      /* sandbox: process.env.REACT_APP_PAYPAL_SANDBOX, */
      production: process.env.REACT_APP_PAYPAL_LIVE,
    },
  };
  const PayPalButton = Paypal.Button.driver("react", { React, ReactDOM });

  if (typePayment === "stripe") return null;

  const payment = (data, actions) => {
    const payment = {
      transactions: [
        {
          amount: {
            total: appointment.amount,
            currency: paypalConfig.currency,
          },
          description: "Compra servicio consultoria",
          custom: appointment.name || "",
          item_list: {
            items: [
              {
                sku: appointment.idProduct,
                name: `${appointment.summary} - ${appointment.product}`,
                price: appointment.amount,
                quantity: 1,
                currency: "MXN",
              },
            ],
          },
        },
      ],
      note_to_payer: "Contáctanos para cualquier aclaración",
    };

    return actions.payment.create({ payment });
  };

  const onAuthorize = (data, actions) => {
    return actions.payment
      .execute()
      .then(async (response) => {
        const paymentData = {
          idPaypal: response.id,
          username: appointment.name,
          total: appointment.amount,
          typePay: "paypal",
          isService: true,
          idService: appointment.idProduct,
          summary: appointment.summary,
        };
        await clienteAxios
          .post(`/appointment/payment/paypal/confirm/`, {
            paymentData,
            appointment,
          })
          .then((res) => {
            setPaymentStatus({
              status: "success",
              data: {
                idPago: res.data.idPay,
                conferenceData: res.data.conferenceData,
                message:
                  "Reunion Agendada: Verifica tu correo electrónico para ver los datos de la reunión",
              },
            });
            setTimeout(() => {
              handleNext();
            }, 1000);
          })
          .catch((err) => {
            console.log(err);
            setSnackbar({
              open: true,
              mensaje: err.message,
              status: "error",
            });
            setPaymentStatus({
              status: "error",
              concretado: true,
              data: {
                idPago: err.response ? err.response.data?.idPay : "",
                message:
                  "Se Realizo el pago pero ocurrió un error desconocido al crear reunión, por favor comunícate al soporte, lamentamos las molestias.",
              },
            });
            handleNext();
          });
      })
      .catch((error) => {
        console.log(error);
        setSnackbar({
          open: true,
          mensaje: error.message,
          status: "error",
        });
      });
  };

  const onError = (error) => {
    setSnackbar({
      open: true,
      mensaje: error,
      status: "error",
    });
  };

  const onCancel = (data, actions) => {
    setSnackbar({
      open: true,
      mensaje: "Pago cancelado",
      status: "info",
    });
  };

  return (
    <Box>
      <PayPalButton
        env={paypalConfig.env}
        client={paypalConfig.client}
        payment={(data, actions) => payment(data, actions)}
        onAuthorize={(data, actions) => onAuthorize(data, actions)}
        onCancel={(data, actions) => onCancel(data, actions)}
        onError={(error) => onError(error)}
        style={{
          label: "paypal",
          size: "small",
          height: 35,
          shape: "rect",
          color: "blue",
          tagline: false,
        }}
      />
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
    </Box>
  );
}
