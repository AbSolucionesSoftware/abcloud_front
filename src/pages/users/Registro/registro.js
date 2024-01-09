import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Hidden } from "@material-ui/core";
import FormRegistroUsuario from "./form_registro";

const useStyles = makeStyles((theme) => ({
  color: {
    backgroundColor: theme.palette.background.paper,
  },
  imagen: {
    minHeight: "90vh",
    backgroundImage: `url(https://source.unsplash.com/random?cursos-online)`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
}));

export default function RegistroUsuario(props) {
  const token = localStorage.getItem("token");
  const classes = useStyles();

  if (token) {
    props.history.push("/");
  }

  return (
    <Grid container direction="row" className={classes.color}>
      <Hidden xsDown>
        <Grid item sm={6} md={6} lg={8}>
          <Box className={classes.imagen} />
        </Grid>
      </Hidden>
      <Grid item xs={12} sm={6} md={6} lg={4} className={classes.color}>
        <FormRegistroUsuario />
      </Grid>
    </Grid>
  );
}
