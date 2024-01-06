import React, { Fragment } from "react";
import QueueAnim from "rc-queue-anim";
import { makeStyles, Grid, Box, Typography } from "@material-ui/core";
import Carousel from "react-material-ui-carousel";
import imagenBanner from "../../../../images/banner3.jpg";
import logoUniline from "../../../../images/uniline3.png";

const useStyles = makeStyles((theme) => ({
  imagen: {
    maxHeight: "100%",
    maxWidth: "100%",
    borderRadius: "100%",
  },
  bannerContainer: {
    minHeight: "65vh",
    backgroundImage: `url(${imagenBanner})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    [theme.breakpoints.down("xs")]: {
      minHeight: "90vh",
    },
  },
  imagenLogo: {
    height: 120,
    [theme.breakpoints.down("xs")]: {
      height: 100,
      width: "100%",
    },
  },
}));

export default function BannerDefault() {
  const classes = useStyles();

  return (
    <Fragment>
      <Carousel interval={5000} indicators={false}>
        <Grid container className={classes.bannerContainer} display="flex">
          <Grid item md={6} lg={7} xs={12}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Box p={5}>
                <QueueAnim delay={700} className="queue-simple">
                  <Box key="a">
                    <img
                      alt="logo uniline"
                      src={logoUniline}
                      className={classes.imagenLogo}
                    />
                    <Box my={2} style={{ color: "#F9F9F9" }}>
                      <Typography variant="h4">
                        <b>APRENDE DESDE CASA EN EL MOMENTO QUE TÚ QUIERAS.</b>
                      </Typography>
                    </Box>
                  </Box>
                </QueueAnim>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Carousel>
    </Fragment>
  );
}
