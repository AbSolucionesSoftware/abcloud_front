import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CardCursoPack from "../CardCursoPack";

function ContainerCursos({ paquete }) {
  return (
    <Box>
      <Box my={2}>
        <Grid container spacing={2}>
          {paquete.courses.map((res, index) => (
            <Grid key={index} item md={4} xs={12}>
              <CardCursoPack cursoObj={res} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default ContainerCursos;
