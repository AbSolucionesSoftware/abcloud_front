import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../../config/themeConfig";
import darkMode from "../../config/darkMode";
import { CssBaseline } from "@material-ui/core";
import { NavProvider } from "../../context/context_nav";
import DashboarUsuario from "../../pages/users/Dashboard_Usuario/dashboard";
import { DashProvider } from "../../context/dashboar_context";
import MantenimientoImg from "./Mantenimiento_img.png";
import mantenimiento from "../../context/context_mantenimiento";

export default function LayoutDashboardUser(props) {
  let thema = localStorage.getItem("tema");
  const token = localStorage.getItem("token");
  let tema = JSON.parse(thema);
  const [darkTheme, setDarkTheme] = useState(tema);

  if (!token) {
    props.history.push("/");
  }

  useEffect(() => {
    if (tema === null) {
      localStorage.setItem("tema", false);
      return;
    }
  }, [tema]);

  if (mantenimiento) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>
          <img
            alt="Imagen no disponible"
            style={{ width: "700px" }}
            src={MantenimientoImg}
          />
          <p style={{ fontSize: "40px", textAlign: "center" }}>
            Estamos haciendo cambios
          </p>
          <p style={{ fontSize: "30px", textAlign: "center" }}>
            para brindarte una mejor experiencia.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={tema === true ? darkMode : theme}>
      <CssBaseline />
      <div>
        <NavProvider>
          <DashProvider>
            <DashboarUsuario tema={[darkTheme, setDarkTheme]} />
          </DashProvider>
        </NavProvider>
      </div>
    </ThemeProvider>
  );
}
