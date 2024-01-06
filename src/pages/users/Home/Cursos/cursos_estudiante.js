import React, { useCallback, useEffect, useState } from "react";
import { Box, makeStyles, Typography } from "@material-ui/core";
import clienteAxios from "../../../../config/axios";
import SpinNormal from "../../../../components/Spin/spinNormal";
import Error500 from "../../../error500";
import CardsCursosEstudiantes from "../../CardCurso/card_curso_estudiante";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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

export default function CursosComprados() {
  const classes = useStyles();
  let token = localStorage.getItem("token");
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ error: false, message: "" });
  let user = localStorage.getItem("student")
    ? JSON.parse(localStorage.getItem("student"))
    : { _id: "" };

  /* if (token !== 'null') user = JSON.parse(localStorage.getItem('student')); */

  const responsive = {
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
  };

  const obtenerCursosBD = useCallback(async () => {
    if (!user._id) return;
    setLoading(true);
    await clienteAxios
      .get(`/course/user/${user._id}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setCursos(res.data);
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
  }, [token, user._id]);

  const render_cursos = cursos.map((curso, index) => (
    <Box m={1} key={index} height="97%">
      <CardsCursosEstudiantes curso={curso} />
    </Box>
  ));
  /* const render_cursos_lg = cursos.map((curso, index) => (
    <Grid key={index} item>
      <CardsCursosEstudiantes curso={curso} />
    </Grid>
  )); */

  useEffect(() => {
    obtenerCursosBD();
  }, [obtenerCursosBD]);

  if (loading) {
    return <SpinNormal />;
  }
  if (error.error) {
    return <Error500 error={error.message} />;
  }
  if (cursos.length === 0) {
    return null;
  }

  return (
    <Box className={classes.margin}>
      <Typography variant="h4">¡Continua donde te quedaste!</Typography>
      <Box py={2} width="auto">
        <Carousel
          swipeable
          responsive={responsive}
          className={classes.buttons}
          itemClass="carousel-item-padding-40-px"
        >
          {render_cursos}
        </Carousel>
      </Box>
      {/* <Hidden smUp>
        <Box py={2} width="auto">
		<Carousel
          swipeable
          responsive={responsive}
          className={classes.buttons}
          itemClass="carousel-item-padding-40-px"
        >
            {render_cursos}
          </Carousel>
        </Box>
      </Hidden>
      <Hidden xsDown>
        <Box py={2} width="auto">
          <Grid container spacing={3}>
            {render_cursos_lg}
          </Grid>
        </Box>
      </Hidden> */}
    </Box>
  );
}
