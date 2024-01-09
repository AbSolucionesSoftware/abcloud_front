import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Container, Grid, Typography } from "@material-ui/core";
import ExtensionIcon from "@material-ui/icons/Extension";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import UpdateIcon from "@material-ui/icons/Update";
import Scroll from "../../../components/ScrolltoTop/scroll";

const useStyles = makeStyles((theme) => ({
  color1: {
    backgroundColor: "#d1c4e9",
  },
  color2: {
    backgroundColor: "#c5cae9",
  },
  color3: {
    backgroundColor: "#bbdefb",
  },
  fondo: {
    zIndex: 0,
    backgroundColor: theme.palette.background.paper,
    height: "2000px",
    width: "100vw",
    position: "absolute",
  },
  fondo2: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ImagenCorporativa() {
  const classes = useStyles();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Scroll showBelow={250} />
      <Box mt={3}>
        <Box
          //height="90vh"
          textAlign="center"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Container>
            <Box my={5}>
              <Typography variant="h2">Nuestro Sueño</Typography>
            </Box>
            <Box my={4}>
              <Typography variant="h5">
                Nuestro Sueño Ayudar a trabajadores, empresarios, emprendedores,
                profesores, alumnos y toda persona que quiera desarrollarse y
                crecer profesionalmente a través de nuestros cursos en línea
              </Typography>
            </Box>
          </Container>
        </Box>
        <Box
          textAlign="center"
          display="flex"
          justifyContent="center"
          alignItems="center"
          className={classes.fondo2}
		  pb={5}
        >
          <div>
            <Box mb={5}>
              <Typography variant="h2">Valores</Typography>
            </Box>
            <Container>
              <Grid container spacing={2}>
                <Grid item md={4} xs={12}>
                  <Box
                    p={5}
                    width="100%"
                    borderRadius={20}
                    className={classes.color1}
                  >
                    <Box my={2}>
                      <Typography variant="h4">Coherencia</Typography>
                    </Box>
                    <ExtensionIcon style={{ fontSize: 100 }} />
                    <Typography variant="h6" align="justify">
                        Cada curso dentro de nuestra plataforma será
                        por una persona experta en el área la cual tiene
                        conocimientos y experiencia, la mezcla entre estas dos
                        partes nos permite ofrecer cursos con un alto contenido
                        de valor profesional.
                      </Typography>
                  </Box>
                </Grid>
                <Grid item md={4} xs={12}>
                  <Box
                    p={5}
                    width="100%"
                    borderRadius={20}
                    className={classes.color2}
                  >
                    <Box my={2}>
                      <Typography variant="h4">Innovación</Typography>
                    </Box>
                    <EmojiObjectsIcon style={{ fontSize: 100 }} />
                    <Box textAlign="justify">
                      <Typography variant="h6">
                        Siempre en búsqueda de ofrecer la mejor experiencia
                        hacia el usuario, en UNILINE nos dedicamos a crear
                        metodologías tanto de navegación como de aprendizaje
                        para ofrecer una experiencia agradable en cada segundo
                        que nos visualices.
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item md={4} xs={12}>
                  <Box
                    p={5}
                    width="100%"
                    borderRadius={20}
                    className={classes.color3}
                  >
                    <Box my={2}>
                      <Typography variant="h4">Actualización</Typography>
                    </Box>
                    <UpdateIcon style={{ fontSize: 100 }} />
                    <Box textAlign="justify">
                      <Typography variant="h6">
                        Trabajaremos todos los días en la actualización de
                        contenido, buscando ofrecer las mejores herramientas
                        para nuestros cursos, con la finalidad de que pueda
                        sentir un verdadero cambio al termino de estos.
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </div>
        </Box>
      </Box>
    </div>
  );
}
