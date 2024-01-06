import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import NavegacionUsuario from "../Navegacion_User/navegacion";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../../config/themeConfig";
import darkMode from "../../config/darkMode";
import { Box, CssBaseline, makeStyles } from "@material-ui/core";
import Footer from "../Footer/footer";
import { NavProvider } from "../../context/context_nav";
import MantenimientoImg from "./Mantenimiento_img.png";
import mantenimiento from "../../context/context_mantenimiento";

const useStyles = makeStyles((theme) => ({
  offset: {
    [theme.breakpoints.down("sm")]: {
      minHeight: theme.spacing(7),
    },
  },
}));

export default function LayoutUsers(props) {
  let thema = localStorage.getItem("tema");
  let tema = JSON.parse(thema);
  const { routes } = props;
  const [darkTheme, setDarkTheme] = useState(tema);
  const classes = useStyles();

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
            style={{ width: "500px", paddingTop: "70px", margin: "0px" }}
            src={MantenimientoImg}
          />
          <p style={{ fontSize: "40px", textAlign: "center", margin: "10px" }}>
            MANTENIMIENTO!!
          </p>
          <p style={{ fontSize: "30px", textAlign: "center", margin: "0px" }}>
            Estamos haciendo cambios
          </p>
          <p style={{ fontSize: "30px", textAlign: "center", margin: "0px" }}>
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
          <NavegacionUsuario tema={[darkTheme, setDarkTheme]} />
          <Box style={{ minHeight: "90vh" }}>
            <LoadRoutes routes={routes} />
          </Box>
        </NavProvider>
        <Footer darkTheme={darkTheme} />
        <div className={classes.offset} />
      </div>
    </ThemeProvider>
  );
}

function LoadRoutes({ routes }) {
  return (
    <Switch>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          component={route.component}
        />
      ))}
    </Switch>
  );
}
