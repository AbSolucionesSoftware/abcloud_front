import React from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { DoneTwoTone } from "@material-ui/icons";
import { ConsultaContext } from "../Context";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  const { paymentStatus } = React.useContext(ConsultaContext);

  if (paymentStatus.status !== "success") return null;

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        py={4}
      >
        <DoneTwoTone color="secondary" style={{ fontSize: 40 }} />
        <Typography variant="h6">Pago Realizado</Typography>
        <Typography align="center">{paymentStatus.data.message}</Typography>
        <Box my={1} />
        <Typography>
          <b>{`ID de pago: ${paymentStatus.data.idPago}`}</b>
        </Typography>
        <Typography>
          <b>{`ID Google Meet: ${paymentStatus.data.conferenceData?.idGoogleMeet}`}</b>
        </Typography>
        <Typography>
          <b>{`Enlace Google Meet: ${paymentStatus.data.conferenceData?.linkMeeting}`}</b>
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="secondary"
        disableElevation
        fullWidth
        component={Link}
        to="/"
      >
        Regresar a inicio
      </Button>
    </Box>
  );
}
