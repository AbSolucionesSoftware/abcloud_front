import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  useTheme,
  Button,
  CircularProgress,
} from "@material-ui/core";
import HighlightOffTwoToneIcon from "@material-ui/icons/HighlightOffTwoTone";
import clienteAxios from "../../../config/axios";
import { Receipt, WhatsApp } from "@material-ui/icons";

export default function PaymentLinkFailed(props) {
  const { idPaymentLink } = props.match.params;
  const theme = useTheme();
  const [paymentLink, setPaymentLink] = useState();
  const [loading, setLoading] = useState(true);

  const getPaymentLink = useCallback(async () => {
    await clienteAxios
      .get(`/paymentlink/${idPaymentLink}`)
      .then((res) => {
        setLoading(false);
        setPaymentLink(res.data.response);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [idPaymentLink]);

  useEffect(() => {
    getPaymentLink();
  }, [getPaymentLink]);

  if (loading) {
    return (
      <Box
        height="60vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size={40} color="primary" />
        <Typography>Espera un momento por favor</Typography>
      </Box>
    );
  }
  if (!paymentLink) return null;

  return (
    <Box
      height="70vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{ backgroundColor: theme.palette.background.paper }}
    >
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center">
          <HighlightOffTwoToneIcon
            style={{ fontSize: 100, color: theme.palette.error.main }}
          />
        </Box>
        <Box mt={3} textAlign="center">
          <Typography variant="h5">
            <b>Hubo un problema con su pago</b>
          </Typography>
          <br />
          <Typography variant="h6">
            <b>{`${paymentLink.typePayment} ID: ${paymentLink.paymentID}`}</b>
          </Typography>
          <Typography variant="h6">{`Description: ${paymentLink.product}`}</Typography>
        </Box>
        <Box my={5} display="flex" justifyContent="center">
          <Button
            color="primary"
            size="small"
            variant="contained"
            disableElevation
            startIcon={<Receipt />}
            href={paymentLink.url}
            target="_blank"
          >
            Reintentar pago
          </Button>
          <Box mx={1} />
          <Button
            size="small"
            color="primary"
            startIcon={<WhatsApp />}
            href={`https://wa.me/5213171297626?text=Hola,%20tengo%20un%20problema%20con%20este%20pago: ${paymentLink.paymentID}`}
            target="_blank"
          >
            Notificar
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
