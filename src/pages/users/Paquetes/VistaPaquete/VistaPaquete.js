import React, { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  CardMedia,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { makeStyles } from "@material-ui/core/styles";
import clienteAxios from "../../../../config/axios";
import Spin from "../../../../components/Spin/spin";
import Error500 from "../../../error500";
import MetaTags from "react-meta-tags";
import MessageSnackbar from "../../../../components/Snackbar/snackbar";
import {
  formatoFechaCurso,
  formatoMexico,
} from "../../../../config/reuserFunction";
import ActionsPaquete from "./ActionsPaquete";
import ContainerCursos from "./ContainerCursos";

const useStyles = makeStyles((theme) => ({
  contenedor: {
    position: "relative",
    padding: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2),
    },
  },

  avatarGroup: {
    display: "flex",
    justifyContent: "center",
  },
  avatarCourse: {
    height: 120,
    width: 120,
  },
  avatarContainer: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    minHeight: "40%",
    [theme.breakpoints.down("sm")]:{
      minHeight: "25%",
    }
  }
}));

export default function VistaPaquete(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [paquete, setPaquete] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorQuery, setErrorQuery] = useState({ error: false, message: "" });
  const slug = props.match.params.url;
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  const obtenerPaqueteBD = useCallback(async () => {
    setLoading(true);
    await clienteAxios
      .get(`/packages/paquete/${slug}`)
      .then((res) => {
        setLoading(false);
        setPaquete(res.data);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setErrorQuery({ error: true, message: err.response.data.message });
        } else {
          setErrorQuery({
            error: true,
            message: "Al parecer no se a podido conectar al servidor.",
          });
        }
      });
  }, [slug]);

  useEffect(() => {
    obtenerPaqueteBD();
    window.scrollTo(0, 0);
  }, [obtenerPaqueteBD]);

  if (errorQuery.error) {
    return <Error500 error={errorQuery.message} />;
  }

  if (paquete.length === 0) {
    return <Spin loading={loading} />;
  }

  if (!paquete.active) props.history.push("/");

  return (
    <Box>
      <MetaTags>
        <title>UNILINE</title>
        <meta
          id="meta-description-pack"
          name="description"
          content={paquete.description}
        />
        <meta id="og-title-pack" property="og:title" content={paquete.title} />
        <meta id="og-image-pack" property="og:image" content={paquete.image} />
        <meta
          id="og-url-pack"
          property="og:url"
          content={"https://uniline.online/paquete/" + paquete.slug}
        />
      </MetaTags>
      <Container className={classes.contenedor} maxWidth="md">
        <Box p={1} borderRadius={5} bgcolor={theme.palette.background.paper}>
          <Grid container spacing={2} style={{ minHeight: 200 }}>
            <Grid item sm={4} xs={12}>
              {paquete.image ? (
                <CardMedia style={{ height: 200 }} image={paquete.image} />
              ) : (
                <Box className={classes.avatarContainer}>
                  <AvatarGroup max={4} className={classes.avatarGroup}>
                    {paquete.courses.map((res, index) => (
                      <Avatar
                        key={index}
                        className={classes.avatarCourse}
                        alt={` curso ${index}`}
                        src={res.course?.urlPromotionalImage}
                      />
                    ))}
                  </AvatarGroup>
                </Box>
              )}
            </Grid>
            <Grid item sm={8} xs={12}>
              <Box height="100%">
                <Typography variant="h5" component="h1">
                  <b>{paquete.title}</b>
                </Typography>
                <Typography variant="body2">
                  {`Creado el ${formatoFechaCurso(paquete.createdAt)} por ${
                    paquete.idProfessor.name
                  }`}
                </Typography>
                <Box className={classes.description}>
                  <Typography variant="body1" component="h2">
                    {paquete.description}
                  </Typography>
                </Box>
                <Box my={2}>
                  <Grid container justify="space-between">
                    <Grid>
                      <Typography variant="h5">
                        Por solo ${formatoMexico(paquete.pricePack)} MXN
                      </Typography>
                    </Grid>
                    <Grid>
                      <ActionsPaquete
                        props={props}
                        paquete={paquete}
                        setSnackbar={setSnackbar}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box mt={2}>
          <ContainerCursos paquete={paquete} />
        </Box>
      </Container>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
    </Box>
  );
}
