import React from "react";
import { Box, Typography } from "@material-ui/core";
import moment from "moment";
import { formatoMexico } from "../../../../config/reuserFunction";
import { ConsultaContext } from "../Context";
import ABIcon from "../../../../Icons/ABIcon";

export default function InfoConsulta() {
  moment.locale("es-mx");
  const { appointment } = React.useContext(ConsultaContext);
  const { hours, baseAmount, amount, fecha, hora, minuto } = appointment;

  if (!fecha) return null;

  const start = moment(fecha).hour(hora).minute(minuto);
  const end = moment(start).add(hours, "hours");
  return (
    <Box mt={1}>
      <Box display="flex" alignItems="center" height={100} py={1}>
        <ABIcon size={10} color="primary" />
      </Box>
      <Typography variant="h6">
        <b>{`${appointment.summary} - ${appointment.product}`}</b>
      </Typography>
      <Typography variant="subtitle2">{`${appointment.name} - ${appointment.email}`}</Typography>
      <Typography variant="h6">{appointment.description}</Typography>
      <br />
      <Typography>
        {`Programar reunión para el dia ${moment(fecha).format(
          "LL"
        )} de ${moment(start).format("LT")} a ${moment(end).format(
          "LT"
        )} Hora México`}
      </Typography>
      <Typography>
        Al concretar pago se te enviara el enlace de la reunion
      </Typography>
      <br />
      <Typography>
        Subtotal: <b>${formatoMexico(baseAmount)}</b>
      </Typography>
      <Typography>
        Horas: <b>{hours}</b>
      </Typography>
      <Typography variant="h6">
        Total: <b>${formatoMexico(amount)}</b>
      </Typography>
    </Box>
  );
}
