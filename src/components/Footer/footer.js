import React from "react";
import "./footer.scss";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, Box, Typography } from "@material-ui/core";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  EmojiObjectsOutlined,
  Facebook,
  Instagram,
  Policy,
  VerifiedUserOutlined,
  WhatsApp,
  YouTube,
} from "@material-ui/icons";
import LinkMaterial from "@material-ui/core/Link";
import ABIcon from "../../Icons/ABIcon";

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: theme.palette.background.paper,
  },
  imgContainer: {
    height: 80,
    display: "flex",
    justifyContent: "center",
  },
  cover: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
}));

export default function Footer({ darkTheme }) {
  const classes = useStyles();
  const year_footer = moment().format("YYYY");

  return (
    <Box
      position="relative"
      zIndex="2"
      className={classes.background}
      p={5}
    >
      <Grid container spacing={5} justifyContent="center">
        <Grid
          item
          md={1}
          xs={12}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ABIcon size={10} color="primary" style={{ marginRight: 10 }} />
        </Grid>
        <Grid item>
          <Box>
            <Box display="flex" mb={0.5}>
              <Facebook color="action" />
              <Box mr={1} />
              <Typography>
                <LinkMaterial
                  target="_blank"
                  rel="noopener"
                  href="https://www.facebook.com/ConsultoresABsolucionesempresariales/"
                  color="inherit"
                  underline="none"
                >
                  AB Cloud
                </LinkMaterial>
              </Typography>
            </Box>
            <Box display="flex" mb={0.5}>
              <Instagram color="action" />
              <Box mr={1} />
              <Typography>
                <LinkMaterial
                  target="_blank"
                  rel="noopener"
                  href="https://www.instagram.com/ab_cloud_soluciones/"
                  color="inherit"
                  underline="none"
                >
                  @ab_cloud_soluciones
                </LinkMaterial>
              </Typography>
            </Box>
            <Box display="flex" mb={1}>
              <YouTube color="action" />
              <Box mr={1} />
              <Typography>
                <LinkMaterial
                  target="_blank"
                  rel="noopener"
                  href="https://www.youtube.com/@Consultoresabcloud"
                  color="inherit"
                  underline="none"
                >
                  @Consultoresabcloud
                </LinkMaterial>
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item>
          <Box>
            <Box display="flex" mb={0.5}>
              <VerifiedUserOutlined color="action" />
              <Box mr={1} />
              <Typography>
                <LinkMaterial
                  component={Link}
                  to="/buscar-certificado"
                  color="inherit"
                  underline="none"
                >
                  Verificar Certificado
                </LinkMaterial>
              </Typography>
            </Box>
            <Box display="flex" mb={0.5}>
              <Policy color="action" />
              <Box mr={1} />
              <Typography>
                <LinkMaterial
                  component={Link}
                  to="/politicas"
                  color="inherit"
                  underline="none"
                >
                  Políticas de privacidad
                </LinkMaterial>
              </Typography>
            </Box>
            <Box display="flex" mb={0.5}>
              <EmojiObjectsOutlined color="action" />
              <Box mr={1} />
              <Typography>
                <LinkMaterial
                  component={Link}
                  to="/imagen_corporativa"
                  color="inherit"
                  underline="none"
                >
                  Imagen corporativa
                </LinkMaterial>
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item>
          <Box>
            <Box display="flex" mb={0.5}>
              <WhatsApp color="action" />
              <Box mr={1} />
              <Typography>+52 1 317 389 1962</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <LocationOnIcon color="action" />
              <Box mr={1} />
              <Box>
                {/* <Typography>
                  Gomez Farias #43 (Planta alta), Col. Centro.
                </Typography> */}
                <Typography>Autlán de Navarro, Jalisco, México.</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="center" mt={2}>
        <Typography>©AB Cloud {year_footer}</Typography>
      </Box>
    </Box>
  );
}
