import React, { useEffect, useState } from "react";
import { Box, Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clienteAxios from "../../../config/axios";
import Error500 from "../../error500";
import MessageSnackbar from "../../../components/Snackbar/snackbar";
import MetaTags from "react-meta-tags";
import Scroll from "../../../components/ScrolltoTop/scroll";
import InfoPrincipal from "./InfoPrincipal";
import VideoPresentacion from "./VideoPresentacion";
import DetallesCurso from "./DetallesCurso";
import "./styles.css";
import urlPage from "../../../config/url";
import CustomLoader from "../../../components/CustomLoader";

const useStyles = makeStyles((theme) => ({
  background: {
    "& .background": {
      [theme.breakpoints.down("xs")]: {
        position: "fixed",
        minHeight: "90vh",
        width: "100%",
      },
    },
  },
  backgroundBlack: {
    minHeight: "75vh",
    width: "100%",
    position: "relative",
    backgroundColor: "rgba(26, 0, 55, 0.55)!important",
    [theme.breakpoints.down("xs")]: {
      minHeight: "90vh",
      width: "100%",
    },
  },
}));

export default function VistaCurso(props) {
  const classes = useStyles();
  const [cursos, setCursos] = useState([]);
  //const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ error: false, message: "" });
  const idcurso = props.match.params.url;
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  const obtenerCursosBD = React.useCallback(async () => {
    await clienteAxios
      .get(`/course/view-course/${idcurso}`)
      .then((res) => {
        //setLoading(false);
        setCursos(res.data);
      })
      .catch((err) => {
        //setLoading(false);
        if (err.response) {
          setError({ error: true, message: err.response.data.message });
        } else {
          setError({
            error: true,
            message: "Al parecer no se a podido conectar al servidor.",
          });
        }
      });
  }, [idcurso]);

  useEffect(() => {
    obtenerCursosBD();
    window.scrollTo(0, 0);
  }, [obtenerCursosBD]);

  if (error.error) {
    return <Error500 error={error.message} />;
  }

  if (cursos.length === 0) return <CustomLoader text="CARGANDO..." />;

  if (!cursos.course.publication) props.history.push("/");

  return (
    <Box>
      <MetaTags>
        <title>AB Cloud</title>
        <meta
          id="meta-description-curso"
          name="description"
          content={cursos.course.description}
        />
        <meta
          id="og-title-curso"
          property="og:title"
          content={cursos.course.title}
        />
        <meta
          id="og-image-curso"
          property="og:image"
          content={cursos.course.urlPromotionalImage}
        />
        <meta
          id="og-url-curso"
          property="og:url"
          content={`${urlPage}/curso/${cursos.course.slug}`}
        />
      </MetaTags>
      <Scroll showBelow={250} bottomMargin={62} />

      <Box
        id="adquirir"
        style={{ scrollMarginTop: 70 }}
        className={classes.background}
      >
        <Box
          className="background"
          style={{
            backgroundImage: `url(${cursos.course.urlPromotionalImage})`,
          }}
        />
        <Box className={classes.backgroundBlack}>
          <Container maxWidth="lg" className={classes.container}>
            <Box py={5}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                  <InfoPrincipal cursos={cursos} setSnackbar={setSnackbar} />
                </Grid>
                <Grid item xs={12} md={5}>
                  <VideoPresentacion cursos={cursos} />
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
        <DetallesCurso curso={cursos} />
        <MessageSnackbar
          open={snackbar.open}
          mensaje={snackbar.mensaje}
          status={snackbar.status}
          setSnackbar={setSnackbar}
        />
      </Box>
    </Box>
  );
}
