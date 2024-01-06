import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
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

export default function CursosDisponibles() {
  const classes = useStyles();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ error: false, message: "" });

  const obtenerCursosBD = useCallback(async () => {
    setLoading(true);
    await clienteAxios
      .get(`/course/get/by_category`)
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

  /* const render_cursos = cursos.map((curso, index) => <CardsCursos key={index} curso={curso} />); */
  /* const render_cursos_lg = cursos.map((curso, index) => (
    <Grid key={index} item xs={6} lg={3} md={4}>
      <CardsCursos curso={curso} />
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

  return (
    <Box className={classes.margin}>
      {/* <Typography variant="h4">¡Nuestros cursos!</Typography> */}
      {/* <Hidden smUp>
				<Box py={2} width="auto">
					<Carousel swipeable responsive={responsive}>
						{render_cursos}
					</Carousel>
				</Box>
			</Hidden>
			<Hidden xsDown>
				<Box py={2} width="auto">
					<Grid container spacing={3} >
						{render_cursos_lg}
					</Grid>
				</Box>
			</Hidden> */}
      <Box width="auto">
        {/* <Grid container spacing={3}>
          {render_cursos_lg}
        </Grid> */}
        {cursos.map((res, index) => (
          <RenderByCategories key={index} data={res} />
        ))}
      </Box>
    </Box>
  );
}

const RenderByCategories = ({ data }) => {

  const render_cursos = data.courses.map((curso, index) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
      <CardsCursos curso={curso.course} cursoData={curso} />
    </Grid>
  ));

  /* const render_cursos = data.courses.map((curso, index) => (
    <Box mx={2} key={index}>
      <CardsCursos curso={curso.course} cursoData={curso} />
    </Box>
  )); */
  /* const render_cursos_lg = data.courses.map((curso, index) => (
    <Grid key={index} item xs={6} lg={3} md={4}>
      <CardsCursos curso={curso.course} cursoData={curso} />
    </Grid>
  )); */

  return (
    <Box mt={3} mb={10}>
      <Box my={2}>
        <Typography variant="h4">{data.category}</Typography>
      </Box>
      <Box my={2}>
        <Grid container spacing={2}>
          {render_cursos}
        </Grid>
      </Box>
      {/* <Hidden mdUp>
        <Box width="auto">
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
      <Hidden smDown>
        <Grid container spacing={3}>
          {render_cursos_lg}
        </Grid>
      </Hidden> */}
    </Box>
  );
};
