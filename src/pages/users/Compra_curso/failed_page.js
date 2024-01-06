import React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useTheme } from "@material-ui/core";
import HighlightOffTwoToneIcon from "@material-ui/icons/HighlightOffTwoTone";
import { Link } from "react-router-dom";
import clienteAxios from "../../../config/axios";
import { Replay, WhatsApp } from "@material-ui/icons";

export default function PagoFailed(props) {
  const message = props.match.params.message;
  const idPago = props.match.params.idPago;
  const theme = useTheme();
  const token = localStorage.getItem("token");
  const [pago, setPago] = React.useState();

  const getPago = React.useCallback(async () => {
    await clienteAxios
      .get(`/pay/${idPago}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setPago(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, idPago]);

  React.useEffect(() => {
    getPago();
  }, [getPago]);

  if (!pago && idPago !== "paypal") return null;
  if (!token || token === null) props.history.push("/");

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
          <Typography variant="h5">{message}</Typography>
        </Box>
        <Box my={5} display="flex" justifyContent="center">
          <Button
            color="primary"
            size="small"
            variant="contained"
            disableElevation
            startIcon={<Replay />}
            component={Link}
            to="/compra"
          >
            Reintentar pago
          </Button>
          <Box mx={1} />
          <Button
            size="small"
            color="primary"
            startIcon={<WhatsApp />}
            href={`https://wa.me/5213171297626?text=Hola,%20tengo%20un%20problema%20con%20este%20pago: ${pago._id}`}
            target="_blank"
          >
            Notificar
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
