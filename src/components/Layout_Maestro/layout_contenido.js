import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import NavegacionContenidoCurso from "../../pages/maestro/Subir_curso/navegacion_contenido_curso";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../../config/themeConfig";
import darkMode from "../../config/darkMode";
import { CursoProvider } from "../../context/curso_context";
/* import Sesion from '../Verificacion_sesion/verificacion_sesion'; */
import MantenimientoImg from "./Mantenimiento_img.png";
import mantenimiento from "../../context/context_mantenimiento";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
  },
  contentRoutes: {
    minHeight: 360,
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
  },
}));

export default function LayoutContenidoCurso(props) {
  const { routes } = props;
  const classes = useStyles();
  let thema = localStorage.getItem("tema");
  let tema = JSON.parse(thema);
  const [darkTheme, setDarkTheme] = useState(tema);

  useEffect(() => {
    if (tema === null) {
      localStorage.setItem("tema", false);
      return;
    }
  }, [tema]);

  useEffect(() => {
    //Sesion(props);
  }, [props]);

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
      <div className={classes.root}>
        <CursoProvider>
          <NavegacionContenidoCurso
            tema={[darkTheme, setDarkTheme]}
            props={props}
          />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <div className={classes.contentRoutes}>
              <LoadRoutes routes={routes} />
            </div>
          </main>
        </CursoProvider>
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
