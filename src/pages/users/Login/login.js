import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Hidden } from "@material-ui/core";
import FormLoginUsuario from "./form_login";

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

export default function LoginUsuario(props) {
  const token = localStorage.getItem("token");
  const classes = useStyles();

  if (token) {
    props.history.push("/");
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Grid container direction="row" className={classes.color}>
      <Hidden xsDown>
        <Grid item sm={6} md={6} lg={8}>
          <Box className={classes.imagen} />
        </Grid>
      </Hidden>
      <Grid item xs={12} sm={6} md={6} lg={4} className={classes.color}>
        <FormLoginUsuario />
      </Grid>
    </Grid>
  );
}
