import React from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Error, SentimentDissatisfied } from "@material-ui/icons";
import { ConsultaContext } from "../Context";
import { Link } from "react-router-dom";

export default function PaymentError({ setTypePayment }) {
  const { paymentStatus } = React.useContext(ConsultaContext);

  if (paymentStatus.status !== "error") return null;

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        py={4}
      >
        {paymentStatus.concretado ? (
          <>
            <SentimentDissatisfied color="info" style={{ fontSize: 40 }} />
            <Typography>Ocurrio algo inesperado</Typography>
            <Typography><b>{`ID del pago: ${paymentStatus.data?.idPago}`}</b></Typography>
            <Typography>{`${paymentStatus.data?.message}`}</Typography>
          </>
        ) : (
          <>
            <Error color="error" style={{ fontSize: 40 }} />
            <Typography>{`ID del pago: ${paymentStatus.data?.idPago}`}</Typography>
            <Typography>{`Error: ${paymentStatus.data?.message}`}</Typography>
          </>
        )}
      </Box>
      {paymentStatus.concretado ? (
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
      ) : (
        <Button
          variant="contained"
          color="secondary"
          disableElevation
          fullWidth
          onClick={() => setTypePayment("")}
        >
          Intentar otro método
        </Button>
      )}
    </Box>
  );
}
