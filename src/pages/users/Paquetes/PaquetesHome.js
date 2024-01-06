import React, { useCallback, useEffect, useState } from "react";
import { Box, makeStyles, Typography, Grid } from "@material-ui/core";
import CardPaquete from "./CardPaquete";
//import Carousel from "react-multi-carousel";
//import "react-multi-carousel/lib/styles.css";
import clienteAxios from "../../../config/axios";
import SpinNormal from "../../../components/Spin/spinNormal";
import Error500 from "../../error500";
import MessageSnackbar from "../../../components/Snackbar/snackbar";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      margin: "32px 0px",
    },
  },
  buttons: {
    "& > .react-multiple-carousel__arrow--left": {
      left: `0px!important`,
    },
    "& > .react-multiple-carousel__arrow--right": {
      right: `0px!important`,
    },
  },
}));

export default function PaquetesHome() {
  const classes = useStyles();
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ error: false, message: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  /* const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 3000, min: 1365 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 1365, min: 998 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 998, min: 532 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 532, min: 0 },
      items: 1,
    },
  }; */

  const obtenerPaquetesBD = useCallback(async () => {
    setLoading(true);
    await clienteAxios
      .get(`/packages/`)
      .then((res) => {
        setLoading(false);
        setPaquetes(res.data);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setError({ error: true, message: err.response.data.message });
        } else {
          setError({
            error: true,
            message: "Al parecer no se a podido conectar al servidor.",
          });
        }
      });
  }, []);

  useEffect(() => {
    obtenerPaquetesBD();
  }, [obtenerPaquetesBD]);

  if (loading) {
    return <SpinNormal />;
  }
  if (error.error) {
    return <Error500 error={error.message} />;
  }
  if (!paquetes.length) return null;

  /* const render_paquetes = paquetes.map((paquete, index) => (
    <Box m={2} key={index}>
      <CardPaquete paquete={paquete} setSnackbar={setSnackbar} />
    </Box>
  )); */

  const render_paquetes = paquetes.map((paquete, index) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
      <CardPaquete paquete={paquete} setSnackbar={setSnackbar} />
    </Grid>
  ));

  return (
    <Box className={classes.margin}>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Typography variant="h4">LLevalos juntos</Typography>
      <Box my={2}>
        {/* <Carousel
          swipeable
          responsive={responsive}
          className={classes.buttons}
          itemClass="carousel-item-padding-40-px"
        >
          {render_paquetes}
        </Carousel> */}
        <Grid container spacing={2}>
           {render_paquetes}
        </Grid>
      </Box>
    </Box>
  );
}
