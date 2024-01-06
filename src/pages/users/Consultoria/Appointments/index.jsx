import React from "react";
import {
  Box,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import SelectConsulta from "./SelectConsulta";
import Hours from "./Hours";
import Calendario from "./Calendario";
import moment from "moment";
import { ConsultaContext } from "../Context";
import { Alert } from "@material-ui/lab";

export default function Appoinments() {
  const { appointment, setAppointment, handleSubmit } = React.useContext(
    ConsultaContext
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment((st) => ({ ...st, [name]: value }));
  };

  return (
    <Box my={1}>
      <Alert severity="info">
        <Typography>
          <b>*Nota: </b>El costo de consulta es por hora, ser irá calculando el
          costo según el tiempo deseado
        </Typography>
      </Alert>
      <form id="appointment-form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              size="small"
              name="name"
              margin="dense"
              variant="outlined"
              required
              value={appointment.name}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Nombre:</InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              size="small"
              name="email"
              margin="dense"
              type="email"
              variant="outlined"
              required
              value={appointment.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Email:</InputAdornment>
                ),
              }}
            />
            <SelectConsulta />
            <TextField
              fullWidth
              size="small"
              name="summary"
              margin="dense"
              variant="outlined"
              required
              value={appointment.summary}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Asunto:</InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              size="small"
              name="description"
              variant="outlined"
              margin="dense"
              placeholder="Descripción"
              multiline
              minRows={2}
              value={appointment.description}
              onChange={handleChange}
            />
            <Hours />
            <Box mt={1}>
              <Typography>Fecha seleccionada</Typography>
              {appointment.fecha ? (
                <Typography style={{ fontSize: 18 }}>
                  <b>
                    {moment(appointment.fecha)
                      .hour(appointment.hora)
                      .minute(appointment.minuto)
                      .format("LLLL")}{" "}
                    Hora México
                  </b>
                </Typography>
              ) : (
                "-"
              )}
            </Box>
          </Grid>
          <Grid item md={6} xs={12}>
            <Calendario />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
