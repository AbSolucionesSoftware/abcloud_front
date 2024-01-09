import React, { Fragment } from "react";
import { makeStyles, Box, Typography } from "@material-ui/core";
import ABHorizIcon from "../../../../Icons/ABHorizIcon";

const useStyles = makeStyles((theme) => ({
  bannerContainer: {
    minHeight: "70vh",
    backgroundImage: `url(https://source.unsplash.com/random?cursos-online)`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    [theme.breakpoints.down("xs")]: {
      minHeight: "90vh",
    },
  },
}));

export default function BannerDefault() {
  const classes = useStyles();

  return (
    <Fragment>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={classes.bannerContainer}
      >
        <Box
          height="70vh"
          width="100vw"
          position="absolute"
          sx={{
            backgroundColor: "rgba(0,0,0, 0.3)",
          }}
        />
        <Box textAlign="center" zIndex={10}>
          <ABHorizIcon size={35} />
          <Box my={2} style={{ color: "#F9F9F9" }}>
            <Typography variant="h4">
              <b>APRENDE DESDE CASA EN EL MOMENTO QUE TÚ QUIERAS.</b>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
}
