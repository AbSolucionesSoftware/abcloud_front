import React, { useCallback, useEffect, useState } from "react";
import { Box, makeStyles, Typography , Grid} from "@material-ui/core";
import CardsCursos from "../../CardCurso/card_curso";
//import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import clienteAxios from "../../../../config/axios";
import SpinNormal from "../../../../components/Spin/spinNormal";
import Error500 from "../../../error500";

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

export default function UltimosCursosSubidos() {
  const classes = useStyles();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ error: false, message: "" });

 /*  const responsive = {
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
 */
  const obtenerCursosBD = useCallback(async () => {
    setLoading(true);
    await clienteAxios
      .get(`/course/get/latest`)
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
  }, []);

  const render_cursos = cursos.map((curso, index) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
      <CardsCursos curso={curso.course} cursoData={curso} />
    </Grid>
  ));

  useEffect(() => {
    obtenerCursosBD();
  }, [obtenerCursosBD]);

  if (loading) {
    return <SpinNormal />;
  }
  if (error.error) {
    return <Error500 error={error.message} />;
  }

  return (
    <Box className={classes.margin}>
      <Typography variant="h4">Cursos más recientes</Typography>
      {/* <Box my={2}>
        <Carousel
          swipeable
          responsive={responsive}
          className={classes.buttons}
          itemClass="carousel-item-padding-40-px"
        >
          {render_cursos}
        </Carousel>
      </Box> */}
      <Box my={2}>
        <Grid container spacing={2}>
          {render_cursos}
        </Grid>
      </Box>
    </Box>
  );
}
