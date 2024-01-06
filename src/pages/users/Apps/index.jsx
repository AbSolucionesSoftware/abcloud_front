import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import BannerApps from "./BannerApps";
import CatalogoApps from "./Catalogo";

export default function AppsPage() {
  return (
    <Box>
      <Box>
        <BannerApps />
      </Box>
      <Box px={2} py={6}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" color="secondary">
            Tu Aplicación a la Medida
          </Typography>
          <Typography variant="h4" align="center" color="primary">
            <b>Transformamos Ideas en Realidad Digital</b>
          </Typography>
          <br />
          <Typography variant="h6">
            ¿Buscas una aplicación a medida? En Uniline, convertimos tus ideas
            en soluciones digitales personalizadas. Desde la concepción hasta la
            realidad, creamos la herramienta perfecta para potenciar tu visión.
            ¡Hablemos y llevemos tu proyecto al siguiente nivel!
          </Typography>
        </Container>
        <br />
        <CatalogoApps />  
      </Box>
    </Box>
  );
}
