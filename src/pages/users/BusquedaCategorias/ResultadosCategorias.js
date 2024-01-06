import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Box, Chip, Container, Grid, Typography } from "@material-ui/core";
import clienteAxios from "../../../config/axios";
import SpinNormal from "../../../components/Spin/spinNormal";
import CardsCursos from "../CardCurso/card_curso";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Link } from "react-router-dom";

export default function ResultadoCategorias(props) {
  const busqueda = props.location.search;
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [subcat_list, setSubcatList] = useState([]);

  let categoria = "Todos los cursos";
  let subcategoria = "";

  if (busqueda) {
    const category_split = busqueda.split(/[=&]+/);
    categoria = category_split[1].replace(/%20/g, " ");
    if (category_split.length > 2) {
      subcategoria = category_split[3].replace(/%20/g, " ");
    }
  }

  const obtenerResultados = useCallback(async () => {
    setLoading(true);
    await clienteAxios
      .get(`/categories/filter${busqueda}`)
      .then((res) => {
        setLoading(false);
        setResultados(res.data.cursos);
        setSubcatList(res.data.subcategorias);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [busqueda]);

  const render_cursos = resultados.map((curso, index) => (
    <Grid key={index} item xs={6} lg={3} md={4}>
      <CardsCursos curso={curso.course} cursoData={curso} />
    </Grid>
  ));

  const render_sub = subcat_list.map((sub, index) => (
    <Grid item key={index}>
      <Box m={1}>
        <Chip
          clickable={true}
          component={Link}
          to={`search?category=${categoria}&subcategory=${sub.subCategory}`}
          label={sub.subCategory}
          color="primary"
          variant="outlined"
          onClick={() => console.log()}
        />
      </Box>
    </Grid>
  ));

  useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

  useEffect(() => {
    obtenerResultados();
  }, [obtenerResultados, busqueda]);

  if (loading) {
    return (
      <Box
        height="80vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <SpinNormal />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mt={2}>
        <Box mb={5}>
          <Box
            mb={1}
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h6">{categoria}</Typography>
            {subcategoria ? (
              <Fragment>
                <Box mx={2}>
                  <ArrowForwardIosIcon style={{ fontSize: 16 }} />
                </Box>

                <Typography variant="h6">{subcategoria}</Typography>
              </Fragment>
            ) : null}
          </Box>
          <Grid container justify="center">
            {categoria && categoria !== "Todos los cursos" ? (
              <Grid item>
                <Box m={1}>
                  <Chip
                    clickable={true}
                    component={Link}
                    to={`search?category=${categoria}`}
                    label={categoria}
                    color="primary"
                    onClick={() => console.log()}
                  />
                </Box>
              </Grid>
            ) : null}
            {subcat_list.length ? render_sub : null}
          </Grid>
        </Box>

        <Box mb={4}>
          <Grid container spacing={2}>
            {render_cursos}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
