import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { CircularProgress, Grid, useTheme } from "@material-ui/core";
import StaticCalendar from "./StaticCalendar";
import moment from "moment";
import "moment-timezone";
import clienteAxios from "../../../../config/axios";
import { ConsultaContext } from "../Context";
import { Alert } from "@material-ui/lab";
moment.tz.setDefault("America/Mexico_City").locale("es-mx");

const horas = [];
const minutos = [];

for (var i = 0; i <= 23; i++) {
  horas.push(i);
}
for (var k = 0; k <= 59; k++) {
  minutos.push(k);
}

export default function Calendario() {
  const { appointment, setAppointment, fechaErr } = React.useContext(ConsultaContext);
  const [citas, setCitas] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const theme = useTheme();

  const getAppointment = async () => {
    await clienteAxios
      .get(`/appointment`)
      .then((res) => {
        setCitas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  React.useEffect(() => {
    getAppointment();
  }, []);

  function isHoraMinutoOcupado(hora, minuto) {
    return citas.some((cita) => {
      const dia = moment(appointment.fecha).format("L");
      const diaCita = moment(cita.start).format("L");
      const horaInicio = parseInt(moment(cita.start).get("hour"), 10);
      const minutoInicio = parseInt(moment(cita.start).get("minute"), 10);
      const horaFin = parseInt(moment(cita.end).get("hour"), 10);
      const minutoFin = parseInt(moment(cita.end).get("minute"), 10);

      const seleccionado = moment(dia, "L")
        .hour(hora)
        .minute(minuto)
        .format();
      const inicio = moment(diaCita, "L")
        .hour(horaInicio)
        .minute(minutoInicio)
        .format();
      const fin = moment(diaCita, "L")
        .hour(horaFin)
        .minute(minutoFin)
        .format();
      return dia === diaCita && seleccionado >= inicio && seleccionado <= fin;
    });
  }

  const handleHoraChange = (e, hora) => {
    setAppointment((st) => ({ ...st, hora }));
  };
  const handleMinutoChange = (e, minuto) => {
    setAppointment((st) => ({ ...st, minuto }));
  };

  if (loading) {
    return (
      <Box
        display="flex"
        height="20vh"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <CircularProgress size={30} color="secondary" />
        <Typography>Cargando calendario...</Typography>
      </Box>
    );
  }

  return (
    <Box my={1}>
      {fechaErr ? <Alert severity="error">{fechaErr}</Alert> : null}
      <Typography variant="h6" align="center">
        Selecciona fecha disponible
      </Typography>
      <Grid container spacing={1} justifyContent="center">
        <Grid item md={8} xs={12}>
          <StaticCalendar
            setAppointment={setAppointment}
            appointment={appointment}
          />
        </Grid>
        <Grid item md={2} xs={6}>
          <Box height="40vh">
            <Box display="flex" justifyContent="center">
              <Typography variant="caption">Horas</Typography>
            </Box>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              TabIndicatorProps={{
                style: { display: "none" },
              }}
              style={{ height: "100%", width: "100%" }}
              value={appointment.hora}
              onChange={handleHoraChange}
              TabScrollButtonProps={{
                style: {
                  height: 24,
                },
              }}
            >
              {horas.map((hora, index) => {
                return (
                  <Tab
                    key={`horas-${index}`}
                    label={hora}
                    value={hora}
                    disabled={isHoraMinutoOcupado(hora, appointment.minuto)}
                    style={{
                      minWidth: "100%",
                      borderBottom: "1px solid #d6d6d6",
                      minHeight: 5,
                      padding: 0,
                      backgroundColor:
                        hora === appointment.hora && theme.palette.primary.main,
                      color: hora === appointment.hora && "white",
                    }}
                  />
                );
              })}
            </Tabs>
          </Box>
        </Grid>
        <Grid item md={2} xs={6}>
          <Box height="40vh">
            <Box display="flex" justifyContent="center">
              <Typography variant="caption">Minutos</Typography>
            </Box>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              indicatorColor="primary"
              style={{ height: "100%", width: "100%" }}
              value={appointment.minuto}
              onChange={handleMinutoChange}
              TabScrollButtonProps={{
                style: {
                  height: 24,
                },
              }}
              TabIndicatorProps={{
                style: { display: "none" },
              }}
            >
              {minutos.map((minuto, index) => (
                <Tab
                  key={`minutos-${index}`}
                  name="minuto"
                  label={minuto}
                  value={minuto}
                  disabled={isHoraMinutoOcupado(appointment.hora, minuto)}
                  style={{
                    minWidth: "100%",
                    borderBottom: "1px solid #d6d6d6",
                    minHeight: 5,
                    padding: 0,
                    backgroundColor:
                      minuto === appointment.minuto &&
                      theme.palette.primary.main,
                    color: minuto === appointment.minuto && "white",
                  }}
                />
              ))}
            </Tabs>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
