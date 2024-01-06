import React from "react";
import { Box, Container, Grid, Hidden } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuAnclas from "./MenuAnclas";
import Descripcion from "./Descripcion";
import Aprendizajes from "./Aprendizajes";
import Contenido from "./Contenido";
import Comentarios from "../Comentarios";
import Beneficios from "./Beneficios";

const useStyles = makeStyles((theme) => ({
  contentBody: {
    position: "relative",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function DetallesCurso({ curso }) {
  const classes = useStyles();

  return (
    <Box className={classes.contentBody}>
      <Container maxWidth="lg">
        <MenuAnclas />
        <Box my={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Descripcion curso={curso} />
              <br />
              <Hidden smUp>
                <Beneficios curso={curso} />
              </Hidden>
              <Aprendizajes curso={curso} />
              <br />
              <Contenido curso={curso} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Hidden xsDown>
                <Beneficios curso={curso} />
              </Hidden>
            </Grid>
          </Grid>
        </Box>
        <Comentarios curso={curso} />
      </Container>
    </Box>
  );
}
