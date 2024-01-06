import React from "react";
import { Box, Breadcrumbs, Grid, Link, Typography } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Rating from "@material-ui/lab/Rating";
import { formatoFechaCurso } from "../../../config/reuserFunction";
import MetodosPago from "./MetodosPago";

export default function InfoPrincipal({ cursos, setSnackbar }) {
  return (
    <>
      <Box>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          style={{color: "white", fontSize: 18}}
        >
          <Link
            color="inherit"
            href={`/busqueda/${cursos.course.category}`}
            target="_blank"
            rel="noopener"
          >
            {cursos.course.category}
          </Link>
          <Link
            color="inherit"
            href={`/busqueda/${cursos.course.subCategory}`}
            target="_blank"
            rel="noopener"
          >
            {cursos.course.subCategory}
          </Link>
        </Breadcrumbs>
        <Box my={1} />
        <Typography variant="h3" component="h1" style={{color: "white"}}>
          <b>{cursos.course.title}</b>
        </Typography>
        <Box my={1} />
        <Typography variant="h5" component="h2" style={{color: "white"}}>
          {cursos.course.subtitle}
        </Typography>
        <Box my={2}>
          <Grid container spacing={2}>
            <Grid item>
              <Rating
                name="read-only"
                value={cursos.course.qualification}
                precision={0.5}
                readOnly
              />
            </Grid>
            <Grid item>
              <Typography style={{color: "white"}}>{`${cursos.totalInscription} estudiantes`}</Typography>
            </Grid>
          </Grid>
        </Box>
        <Typography style={{color: "white"}}>
          <b>{`Creado el ${formatoFechaCurso(cursos.course.createdAt)} por ${
            cursos.course.idProfessor.name
          }`}</b>
        </Typography>
        <MetodosPago curso={cursos} setSnackbar={setSnackbar} />
      </Box>
    </>
  );
}
