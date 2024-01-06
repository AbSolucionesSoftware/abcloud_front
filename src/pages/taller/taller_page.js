import {
  Box,
  Container,
  CssBaseline,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
} from "@material-ui/core";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import MessageSnackbar from "../../components/Snackbar/snackbar";
import Spin from "../../components/Spin/spin";
import clienteAxios from "../../config/axios";
import {
  formatoFechaDiagonales,
  formatoFechaDiagonalesSoloDia,
  formatoFechaDiaMes,
} from "../../config/reuserFunction";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import ShowMoreText from "react-show-more-text";
import MantenimientoImg from "../../images/Empty.png";
import imagen from "../../images/uniline3.png";
import InscripcionTaller from "./inscripcion_taller";
import useStyles from "./styles";
import { Link } from "react-router-dom";
import { ArrowBack } from "@material-ui/icons";

export default function TallerPage(props) {
  moment.locale("en");
  const slugCurso = props.match.params.slug;
  const vistaPrevia = localStorage.getItem("vistaPrevia");
  const classes = useStyles();

  const [taller, setTaller] = useState([]);
  const [idCourse, setIdCourse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [production, setProduction] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  const obtenerTaller = useCallback(async () => {
    setLoading(true);
    await clienteAxios
      .get(`/taller/getCourse/${slugCurso}`)
      .then((res) => {
        setTaller(res.data[0]?.taller);
        setIdCourse(res.data[0]._id);
        if (res.data[0]?.taller && res.data[0]?.taller.publicTaller === true) {
          setProduction(true);
          setTaller(res.data[0]?.taller);
          setLoading(false);
        } else {
          if (vistaPrevia && vistaPrevia === "true") {
            setTaller(res.data[0]?.taller);
            setProduction(true);
            setLoading(false);
          } else {
            setTaller(res.data[0]?.taller);
            setLoading(false);
            setProduction(false);
          }
        }
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
  }, [slugCurso, vistaPrevia]);

  useEffect(() => {
    obtenerTaller();
  }, [obtenerTaller]);

  const year_footer = moment().format("YYYY");

  if (!production && !loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>
          <img
            alt="Imagen no disponible"
            style={{ width: "600px" }}
            src={MantenimientoImg}
          />
          <p style={{ fontSize: "40px", textAlign: "center" }}>
            Este taller no esta disponible por el momento.
          </p>
          <p style={{ fontSize: "30px", textAlign: "center" }}>
            Favor de tener paciencia.
          </p>
        </div>
      </div>
    );
  }
  const obtenerMes = (fecha) => {
    if (!fecha) {
      return null;
    } else {
      var newdate = new Date(fecha.replace("-", "/"));
      return newdate.toLocaleDateString("es-MX", { month: "long" });
    }
  };

  const FechasRender = () => {
    if (obtenerMes(taller.fechaInicio) === obtenerMes(taller.fechaFin)) {
      return (
        <Typography className={classes.fecha}>
          Fechas del {formatoFechaDiagonalesSoloDia(taller.fechaInicio)} al{" "}
          {formatoFechaDiagonales(taller.fechaFin)}
        </Typography>
      );
    } else {
      return (
        <Typography className={classes.fecha}>
          Fechas del {formatoFechaDiaMes(taller.fechaInicio)} al{" "}
          {formatoFechaDiagonales(taller.fechaFin)}
        </Typography>
      );
    }
  };

  return (
    <>
      <CssBaseline />
      <div className={classes.colorFondo}>
        <Box position="fixed" ml={2}>
          <IconButton
            size="medium"
            style={{color: "#ffff"}}
            component={Link}
            to="/"
          >
            <ArrowBack />
          </IconButton>
        </Box>

        <Container maxWidth="lg">
          <MessageSnackbar
            open={snackbar.open}
            mensaje={snackbar.mensaje}
            status={snackbar.status}
            setSnackbar={setSnackbar}
          />
          <Spin loading={loading} />

          {/* CONTAINER DE INFORMACION DEL CURSO */}

          <Grid container>
            <Grid container justify="center" item lg={12} xs={12}>
              <Box
                mt={2}
                mb={3}
                textAlign="center"
                className={classes.containerLogo}
              >
                <img
                  className={classes.imagenDimension}
                  src={imagen}
                  alt="Imagen de Ulinine"
                />
              </Box>
            </Grid>
            <Grid item lg={8} xs={12}>
              <Box textAlign="left" p={5}>
                <Box>
                  {taller.fechaFin === taller.fechaInicio ? (
                    <Typography className={classes.fecha}>
                      Único día {formatoFechaDiagonales(taller.fechaInicio)}
                    </Typography>
                  ) : (
                    <FechasRender />
                  )}
                  <Typography className={classes.datosDeInicio}>
                    Horario de {taller.horaInicio} hrs. a {taller.horaFin} hrs.
                    -
                    {taller.sesiones === "0" || taller.sesiones === "1"
                      ? `Una sola sesión de ${taller.duracionSesion}`
                      : ` ${taller.sesiones} sesiones de ${taller.duracionSesion}`}
                  </Typography>
                </Box>
                <Box mt={1} mb={1}>
                  <Divider
                    style={{ width: "90%" }}
                    className={classes.divider}
                  />
                </Box>
                <Box>
                  <Typography className={classes.titulo}>
                    {taller.nameTaller}
                  </Typography>
                </Box>
                <ShowMoreText
                  className={classes.descripcionBlanca}
                  lines={10}
                  more="Leer mas"
                  less="Ver menos"
                  expanded={false}
                >
                  <Box mt={2}>
                    <Typography className={classes.descripcionBlanca}>
                      {taller.descripcionTaller}
                    </Typography>
                  </Box>
                </ShowMoreText>
                <Box mt={4}>
                  <InscripcionTaller
                    idCourse={idCourse}
                    props={props}
                    taller={taller}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid container justify="center" item lg={4} xs={12}>
              <Box mt={3} p={2} className={classes.containerPromocional}>
                <img
                  src={taller.urlImageTaller}
                  className={classes.imagenDimension}
                  alt="Imagen de Ulinine"
                />
              </Box>
            </Grid>
          </Grid>
          
        </Container>
      </div>
      {/* CONTENEDOR DE APREDIZAJES ESPERADOS */}
      <Container maxWidth="lg">
        <Grid container>
          <Grid item lg={12} xs={12}>
            <Box mt={4} textAlign="center">
              <Typography className={classes.tituloSecundario}>
                En este taller aprenderás:
              </Typography>
            </Box>
            <Box p={2} textAlign="left">
              <List>
                {taller?.aprendizajesTaller?.map((res, index) => {
                  return (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <DoneAllIcon className={classes.vinetas} />
                      </ListItemIcon>
                      <ListItemText>
                        <Typography className={classes.descripcionVinetas}>
                          {res.apredizaje}
                        </Typography>
                      </ListItemText>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Grid>
        </Grid>
      </Container>
      {/* CONTAINER DE PROFESOR */}
      <Container maxWidth="lg">
        <Grid container>
          <Grid item lg={12} xs={12}>
            <Box mt={3} textAlign="center">
              <Typography className={classes.tituloSecundario}>
                Conoce a tu instructor
              </Typography>
            </Box>
          </Grid>
          <Grid container justify="center" item lg={5} xs={12}>
            <Box p={5} className={classes.containerPromocional}>
              <img
                src={taller.urlImageMaestro}
                className={classes.imagenDimension}
                alt="Imagen de Ulinine"
              />
            </Box>
          </Grid>

          <Grid item lg={7} xs={12}>
            <Box textAlign="left" mt={2} mb={3}>
              <Box>
                <Typography className={classes.tituloParcial}>
                  {taller.nameMaestro}
                </Typography>
              </Box>
              <Box textAlign="left" style={{ width: "90%" }} mt={2} mb={2}>
                <Divider className={classes.divider} />
              </Box>
              <ShowMoreText
                className={classes.descripcion}
                lines={12}
                more="Leer mas"
                less="Ver menos"
                expanded={false}
              >
                <Box mt={2}>
                  <Typography className={classes.descripcion}>
                    {taller.descripcionMaestro}
                  </Typography>
                </Box>
              </ShowMoreText>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <div className={classes.colorFondo}>
        <Grid item lg={12} xs={12}>
          <Box textAlign="center" p={5}>
            <Box>
              <Typography className={classes.titulo}>
                Participa en este Taller que ofrece Uniline para ti
              </Typography>
            </Box>
            <Box mt={2}>
              <Typography className={classes.descripcionBlanca}>
                Aprende de la mejor manera, con la mejor comodidad desde tu
                casa. Da el siguiente paso a la era digital.
              </Typography>
            </Box>
            {/* BOTON */}
            <InscripcionTaller idCourse={idCourse} props={props} />
          </Box>
        </Grid>

        <Grid container justify="center" item lg={12} xs={12}>
          <Box textAlign="center">
            <Typography className={classes.descripcionBlanca}>
              © AB Soluciones Empresariales {year_footer} All rights reserved.
            </Typography>
          </Box>
        </Grid>
      </div>
    </>
  );
}
