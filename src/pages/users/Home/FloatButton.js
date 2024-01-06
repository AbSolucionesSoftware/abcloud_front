import { Facebook, Instagram, WhatsApp, YouTube } from "@material-ui/icons";
import { Box, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

function FloatButton() {
  const stylesLocal = makeStyles((theme) => ({
    socialIconsContainer: {
      position: "fixed",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: theme.spacing(1),
      bottom: theme.spacing(1),
      right: theme.spacing(0.3),
      zIndex: 100,
      [theme.breakpoints.down("sm")]: {
        marginBottom: theme.spacing(6),
      },
      //   backgroundColor: theme.palette.background.paper,

      //   boxShadow: theme.shadows[4],
    },
    fb: {
      backgroundColor: "#1877f2",
      color: "#fff",
      borderRadius: "50%",
      fontSize: "50px",
      padding: "8px",
      [theme.breakpoints.down("sm")]: {
        fontSize: "45px",
      },
    },
    ig: {
      background:
        "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)",
      color: "#fff",
      borderRadius: "50%",
      fontSize: "50px",
      padding: "8px",
      [theme.breakpoints.down("sm")]: {
        fontSize: "45px",
      },
    },
    yt: {
      backgroundColor: "#FF0000",
      color: "#fff",
      borderRadius: "50%",
      fontSize: "50px",
      padding: "8px",
      [theme.breakpoints.down("sm")]: {
        fontSize: "45px",
      },
    },
    wa: {
      backgroundColor: " #35c42c",
      color: "#fff",
      borderRadius: "50%",
      fontSize: "50px",
      padding: "8px",
      [theme.breakpoints.down("sm")]: {
        fontSize: "45px",
      },
    },
  }));

  const estilo = stylesLocal();

  return (
    <Box className={estilo.socialIconsContainer}>
        <Link
          href="https://www.facebook.com/EscuelaUniline"
          color="inherit"
          target="_blank"
        >
          <Facebook className={estilo.fb} />
        </Link>

        <Link
          href="https://www.instagram.com/uniline.online/?hl=es-la"
          color="inherit"
          target="_blank"
        >
          <Instagram className={estilo.ig} />
        </Link>
        <Link
          href="https://www.youtube.com/@Unilineonline"
          color="inherit"
          target="_blank"
        >
          <YouTube className={estilo.yt} />
        </Link>
        <Link
          href="https://wa.me/5213171297626"
          color="inherit"
          target="_blank"
        >
          <WhatsApp className={estilo.wa} />
        </Link>
    </Box>
  );
}

export default FloatButton;
