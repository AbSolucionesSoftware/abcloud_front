import React from "react";
import { Box, Divider, Grid, Typography } from "@material-ui/core";
import ListaComentarios from "./ListaComentarios";
import Calificaciones from "./Calificaciones";

export default function Comentarios({ curso }) {
  return (
    <>
      <Box id="comentarios" mt={6} style={{ scrollMarginTop: "12em" }}>
        <Box mb={2}>
          <Typography variant="h6">Reseñas y comentarios</Typography>
          <Divider />
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <Calificaciones curso={curso.course} />
          </Grid>
          <Grid item xs={12} md={8}>
            {curso.commentCourse.length > 0 ? (
              curso.commentCourse.map((comentario, index) => (
                <ListaComentarios
                  key={index}
                  comentario={comentario}
                  curso={curso}
                />
              ))
            ) : (
              <Box display="flex" justifyContent="center">
                <Typography variant="h5" color="textSecondary">
                  No hay comentarios en este curso
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
