import React, { Fragment, useCallback, useEffect, useState } from "react";
import { makeStyles, Box, Hidden } from "@material-ui/core";
import Carousel from "react-material-ui-carousel";
import clienteAxios from "../../../../config/axios";
import BannerDefault from "./BannerDefault";
import "./banner.scss";

const useStyles = makeStyles((theme) => ({
  imagen: {
    maxHeight: "100%",
    maxWidth: "100%",
    borderRadius: "100%",
  },
  bannerContainer: {
    minHeight: "65vh",
    /* backgroundImage: `url(${imagenBanner})`, */
    backgroundPosition: "center",
    backgroundSize: "cover",
    [theme.breakpoints.down("xs")]: {
      minHeight: "50vh",
    },
  },
  container2: {
    /* position: "absolute",
	zIndex: 2, */
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
    maxHeight: "70vh",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      minHeight: "40vh",
    },
  },
  imagen2: {
    maxHeight: "100%",
    maxWidth: "100%",
  },
}));

export default function Banner(props) {
  /* const token = localStorage.getItem('token'); */
  const classes = useStyles();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const obtenerBanners = useCallback(async () => {
    setLoading(true);
    await clienteAxios
      .get("/banner/")
      .then((res) => {
        setLoading(false);
        const { banners } = res.data;
        setBanners(banners);
        setLoaded(true);
      })
      .catch((err) => {
        setLoading(false);
        setLoaded(true);
        if (err.response) {
          console.log(err.response);
        } else {
          console.log(err);
        }
      });
  }, []);

  useEffect(() => {
    obtenerBanners();
  }, [obtenerBanners]);

  if (loading) {
    return (
      <Box height="65vh" className="container-animation-loading">
        <div className="loading loading03">
          <span>U</span>
          <span>N</span>
          <span>I</span>
          <span>L</span>
          <span>I</span>
          <span>N</span>
          <span>E</span>
        </div>
      </Box>
    );
  } else if (loaded && banners.length === 0) {
    return <BannerDefault />;
  }

  const redireccion = (banner) => {
    if(!banner.course_ref) return
    props.props.history.push(`/curso/${banner.course_ref}`)
  }

  return (
    <Fragment>
      <Box>
        <Carousel interval={5000} indicators={false}>
          {banners.map((banner, index) => (
            <Box key={index}>
              {/* <Box
                className={classes.bannerContainer}
                style={{ backgroundImage: `url(${banner.image_desktop})` }}
              /> */}
              <Hidden xsDown>
                <Box className={classes.container2} onClick={() => redireccion(banner)}>
                  <img
                    alt={`imagen-${banner.order_number}`}
                    src={banner.image_desktop}
                    className={classes.imagen2}
                  />
                </Box>
              </Hidden>
              <Hidden smUp>
                {!banner.key_devices ? (
                  <BannerDefault />
                ) : (
                  <Box className={classes.container2} onClick={() => redireccion(banner)}>
                    <img
                      alt={`imagen-${banner.order_number}`}
                      src={banner.image_devices}
                      className={classes.imagen2}
                    />
                  </Box>
                )}
              </Hidden>
            </Box>
          ))}
        </Carousel>
      </Box>
    </Fragment>
  );
}
