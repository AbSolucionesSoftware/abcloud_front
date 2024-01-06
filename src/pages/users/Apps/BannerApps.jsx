import React, { Fragment } from "react";
import { makeStyles, Box } from "@material-ui/core";
import "./banner.scss";

const useStyles = makeStyles((theme) => ({
  container2: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: "50vh",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      maxHeight: "40vh",
    },
  },
  imagen: {
    maxHeight: "100%",
    maxWidth: "100%",
  },
}));

export default function BannerApps() {
  const classes = useStyles();
  const url = "https://cursos-uniline.s3.us-west-1.amazonaws.com/apps/AppsBanner.png";

  return (
    <Fragment>
      <Box className={classes.container2}>
        <img alt={`imagen-${url}`} src={url} className={classes.imagen} />
      </Box>
    </Fragment>
  );
}
