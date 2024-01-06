import React, { useEffect } from "react";
import Banner from "./Banner/banner";
import BannerInformartivo from "./Banner_Informativo/banner_informativo";
import CursosComprados from "./Cursos/cursos_estudiante";
import CursosDisponibles from "./Cursos/cursos";
import { Box, Container } from "@material-ui/core";
import { MetaTags } from "react-meta-tags";
import imagenInicio from "../../../images/inicio.jpg";
import UltimosCursosSubidos from "./Cursos/LatestCourses";
import PaquetesHome from "../Paquetes/PaquetesHome";
import FloatButton from "./FloatButton";

export default function Home(props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box>
      <MetaTags>
        <title>UNILINE</title>
        <meta
          id="meta-description"
          name="description"
          content="Aprende en nuestra escuela en linea."
        />
        <meta
          id="og-title"
          property="og:title"
          content="Escuela Al Revés UNILINE"
        />
        <meta id="og-image" property="og:image" content={imagenInicio} />
        <meta id="og-url" property="og:url" content="https://uniline.online/" />
      </MetaTags>
      <Banner props={props} />
      <Container maxWidth="lg">
        <CursosComprados />
        <UltimosCursosSubidos />
        <PaquetesHome />
        <CursosDisponibles />
        <FloatButton />
      </Container>
      <BannerInformartivo />

      {/* 
			<ul>
				<Link to="/compra">pagar curso</Link>
			</ul> */}
    </Box>
  );
}
