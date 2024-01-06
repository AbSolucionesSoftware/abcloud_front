import React, { useContext, useEffect, useState } from "react";
import Scroll from "../../../../../components/ScrolltoTop/scroll";
import Spin from "../../../../../components/Spin/spin";
import { CursoContext } from "../../../../../context/curso_context";
import clienteAxios from "../../../../../config/axios";
import SubirImagenTaller from "./Imagenes/subir_imagen_taller";
import SubirImagenMaestro from "./Imagenes/subir_imagen_maestro";
import AddIcon from "@material-ui/icons/Add";
import {
  Grid,
  Box,
  Button,
  makeStyles,
  Typography,
  TextField,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import MessageSnackbar from "../../../../../components/Snackbar/snackbar";
import EnlacesCorreo from "./lista_enlace_correo";
import { Done } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  BoxActions: {
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.background.paper,
    zIndex: 10,
    position: "fixed",
    bottom: theme.spacing(0),
    right: theme.spacing(0),
    width: "100%",
  },
}));

export default function InformaciónTaller({idcurso, datosTaller, setDatosTaller}) {
  const { datos } = useContext(CursoContext);
  const token = localStorage.getItem("token");

  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [validacion, setValidacion] = useState(false);

  const [respuestaEnlace, setRespuestaEnlace] = useState("");
  const [datosEnlaces, setDatosEnlaces] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  const obtenerRespuesta = (e) => {
    setRespuestaEnlace({
      ...respuestaEnlace,
      [e.target.name]: e.target.value,
    });
  };

  const agregarRespuesta = () => {
    if (!respuestaEnlace) {
      return;
    }
    setDatosEnlaces([
      ...datosEnlaces,
      {
        tituloEnlace: respuestaEnlace.tituloEnlace,
        enlace: respuestaEnlace.enlace,
      },
    ]);
    setRespuestaEnlace("");
  };

  useEffect(() => {
    if (datos.taller?.linksCorreo) {
      setDatosEnlaces(datos.taller.linksCorreo);
    }
  }, [datos]);

  const eliminarRespuesta = (index) => {
    datosEnlaces.splice(index, 1);
    setDatosEnlaces([...datosEnlaces]);
  };

  const registrarTaller = async () => {
    if (
      !datosTaller.nameTaller ||
      !datosTaller.descripcionTaller ||
      !datosTaller.nameMaestro ||
      !datosTaller.descripcionMaestro ||
      !datosTaller.infoCorreo ||
      !datosTaller.fechaInicio ||
      !datosTaller.fechaFin ||
      !datosTaller.horaInicio ||
      !datosTaller.horaFin ||
      !datosTaller.sesiones ||
      !datosTaller.duracionSesion
    ) {
      setValidacion(true);
      setSnackbar({
        open: true,
        mensaje: "Complete todos los campos requeridos",
        status: "error",
      });
      return;
    }

    setLoading(true);
    await clienteAxios
      .put(`/taller/${idcurso}`, {
        nameTaller: datosTaller.nameTaller,
        descripcionTaller: datosTaller.descripcionTaller,
        nameMaestro: datosTaller.nameMaestro,
        descripcionMaestro: datosTaller.descripcionMaestro,
        infoCorreo: datosTaller.infoCorreo,
        linksCorreo: datosEnlaces.length !== 0 ? datosEnlaces : null,

        fechaInicio: datosTaller.fechaInicio,
        fechaFin: datosTaller.fechaFin,
        horaInicio: datosTaller.horaInicio,
        horaFin: datosTaller.horaFin,
        sesiones: datosTaller.sesiones,
        duracionSesion: datosTaller.duracionSesion,

        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setSnackbar({
            open: true,
            mensaje: err.response.data.message,
            status: "error",
          });
        } else {
          setSnackbar({
            open: true,
            mensaje: "Al parecer no se a podido conectar al servidor.",
            status: "error",
          });
        }
      });
  };

  const obtenerCampos = (e) => {
    setDatosTaller({
      ...datosTaller,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box mt={2} mb={4}>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Spin loading={loading} />
      <form>
        <Box my={1}>
          <Alert severity="info">
            Éstas descripciones ayudarán a completar la información del taller
            en su pagína de promoción
          </Alert>
        </Box>
        <Box my={2} style={{ width: "100%" }}>
          <TextField
            size="medium"
            fullWidth
            required
            name="nameTaller"
            label="Nombre del Taller"
            variant="outlined"
            value={datosTaller?.nameTaller ? datosTaller?.nameTaller : ""}
            error={validacion && !datosTaller?.nameTaller ? true : false}
            helperText={
              validacion && !datosTaller?.nameTaller ? "Campo requerido" : ""
            }
            onChange={obtenerCampos}
          />
        </Box>
        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <TextField
              size="medium"
              fullWidth
              id="duracionSesion"
              name="duracionSesion"
              placeholder="Ejemplo: 03:00hrs. o 30 mins"
              label="Duración de la sesión"
              className={classes.textField}
              variant="outlined"
              value={
                datosTaller?.duracionSesion ? datosTaller?.duracionSesion : ""
              }
              error={validacion && !datosTaller?.duracionSesion ? true : false}
              helperText={
                validacion && !datosTaller?.duracionSesion
                  ? "Campo requerido"
                  : ""
              }
              onChange={obtenerCampos}
            />
            <Box mt={1} />
            <TextField
              size="medium"
              fullWidth
              id="sesiones"
              name="sesiones"
              label="Número de sesiones"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              className={classes.textField}
              variant="outlined"
              value={datosTaller?.sesiones ? datosTaller?.sesiones : ""}
              error={validacion && !datosTaller?.sesiones ? true : false}
              helperText={
                validacion && !datosTaller?.sesiones ? "Campo requerido" : ""
              }
              onChange={obtenerCampos}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              size="medium"
              fullWidth
              id="fechaInicio"
              name="fechaInicio"
              label="Fecha de Inicio"
              type="date"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={datosTaller?.fechaInicio ? datosTaller?.fechaInicio : ""}
              error={validacion && !datosTaller?.fechaInicio ? true : false}
              helperText={
                validacion && !datosTaller?.fechaInicio ? "Campo requerido" : ""
              }
              onChange={obtenerCampos}
            />
            <Box mt={1} />
            <TextField
              size="medium"
              fullWidth
              id="fechaFin"
              name="fechaFin"
              label="Fecha de Fin"
              type="date"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={datosTaller?.fechaFin ? datosTaller?.fechaFin : ""}
              error={validacion && !datosTaller?.fechaFin ? true : false}
              helperText={
                validacion && !datosTaller?.fechaFin ? "Campo requerido" : ""
              }
              onChange={obtenerCampos}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              size="medium"
              fullWidth
              id="horaInicio"
              label="Hora de inicio"
              name="horaInicio"
              type="time"
              defaultValue="07:30"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              value={datosTaller?.horaInicio ? datosTaller?.horaInicio : ""}
              error={validacion && !datosTaller?.horaInicio ? true : false}
              helperText={
                validacion && !datosTaller?.horaInicio ? "Campo requerido" : ""
              }
              variant="outlined"
              onChange={obtenerCampos}
            />
            <Box mt={1} />
            <TextField
              size="medium"
              fullWidth
              id="horaFin"
              label="Hora de Fin"
              name="horaFin"
              type="time"
              defaultValue="07:30"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              value={datosTaller?.horaFin ? datosTaller?.horaFin : ""}
              error={validacion && !datosTaller?.horaFin ? true : false}
              helperText={
                validacion && !datosTaller?.horaFin ? "Campo requerido" : ""
              }
              variant="outlined"
              onChange={obtenerCampos}
            />
          </Grid>
        </Grid>
        <Box my={2}>
          <TextField
            fullWidth
            required
            name="descripcionTaller"
            id="descripcion-taller"
            label="Descripción de Taller"
            multiline
            rows={6}
            variant="outlined"
            value={
              datosTaller?.descripcionTaller
                ? datosTaller?.descripcionTaller
                : ""
            }
            error={validacion && !datosTaller?.descripcionTaller ? true : false}
            helperText={
              validacion && !datosTaller?.descripcionTaller
                ? "Campo requerido"
                : ""
            }
            size="medium"
            onChange={obtenerCampos}
          />
        </Box>

        <SubirImagenTaller />

        <Box mt={5} mb={1}>
          <Typography variant="h6">Información del profesor</Typography>
        </Box>
        <Box mb={1} mt={2}>
          <Alert severity="info">
            Esta descripción ayudara que los alumnos conozcan un poco mas de su
            profesor
          </Alert>
        </Box>
        <Box my={2}>
          <TextField
            size="medium"
            fullWidth
            required
            name="nameMaestro"
            id="name-maestro"
            label="Nombre del Profesor"
            variant="outlined"
            value={datosTaller?.nameMaestro ? datosTaller?.nameMaestro : ""}
            error={validacion && !datosTaller?.nameMaestro ? true : false}
            helperText={
              validacion && !datosTaller?.nameMaestro ? "Campo requerido" : ""
            }
            onChange={obtenerCampos}
          />
        </Box>
        <Box my={2}>
          <TextField
            fullWidth
            required
            name="descripcionMaestro"
            id="descripcion-maestro"
            label="Descripcion de Profesor"
            multiline
            rows={6}
            variant="outlined"
            value={
              datosTaller?.descripcionMaestro
                ? datosTaller?.descripcionMaestro
                : ""
            }
            error={
              validacion && !datosTaller?.descripcionMaestro ? true : false
            }
            helperText={
              validacion && !datosTaller?.descripcionMaestro
                ? "Campo requerido"
                : ""
            }
            onChange={obtenerCampos}
          />
        </Box>

        <SubirImagenMaestro />

        <Box mt={5} mb={1}>
          <Typography variant="h6">Información del Correo</Typography>
        </Box>
        <Box mb={1} mt={2}>
          <Alert severity="info">
            Esta descripción o información llegara a los usuarios en la
            descripción del correo enviado.
          </Alert>
        </Box>
        <Box my={2}>
          <TextField
            fullWidth
            required
            name="infoCorreo"
            id="info-correo"
            label="Descripcion de correo electronico"
            multiline
            rows={6}
            variant="outlined"
            value={datosTaller?.infoCorreo ? datosTaller?.infoCorreo : ""}
            error={validacion && !datosTaller?.infoCorreo ? true : false}
            helperText={
              validacion && !datosTaller?.infoCorreo ? "Campo requerido" : ""
            }
            onChange={obtenerCampos}
          />
        </Box>
        <Box mb={1} mt={2}>
          <Alert severity="info">
            Esta información se reflejara como enlaces en el correo que llegara
            al usuario.
          </Alert>
        </Box>
        <Box my={2}>
          <Grid container spacing={2}>
            <Grid item md={5} xs={12}>
              <TextField
                size="medium"
                name="tituloEnlace"
                label="Titulo del Enlace"
                fullWidth
                placeholder="Titulo del Enlace"
                variant="outlined"
                onChange={obtenerRespuesta}
                value={
                  respuestaEnlace.tituloEnlace
                    ? respuestaEnlace.tituloEnlace
                    : ""
                }
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <TextField
                size="medium"
                name="enlace"
                label="Enlace de redirección"
                fullWidth
                placeholder="www.enlace-de-zoom.com"
                variant="outlined"
                onChange={obtenerRespuesta}
                value={respuestaEnlace.enlace ? respuestaEnlace.enlace : ""}
              />
            </Grid>
            <Grid
              item
              md={2}
              xs={12}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Button
                startIcon={<AddIcon />}
                color="primary"
                onClick={() => agregarRespuesta()}
                size="large"
              >
                Agregar
              </Button>
            </Grid>
          </Grid>
          <EnlacesCorreo
            datosEnlaces={datosEnlaces}
            eliminarRespuesta={eliminarRespuesta}
            setDatosEnlaces={setDatosEnlaces}
          />
        </Box>
      </form>
      <Scroll showBelow={250} bottomMargin={78} />
      <Box className={classes.BoxActions} boxShadow={3}>
        <Button
          size="large"
          variant="contained"
          color="primary"
          aria-label="Guardar"
          onClick={() => registrarTaller()}
          startIcon={<Done />}
        >
          Guardar
        </Button>
      </Box>
    </Box>
  );
}
