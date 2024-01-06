import React, { useCallback, useContext, useEffect, useState } from "react";
import Spin from "../../../../../components/Spin/spin";
import { CursoContext } from "../../../../../context/curso_context";
import clienteAxios from "../../../../../config/axios";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import MessageSnackbar from "../../../../../components/Snackbar/snackbar";
import { Link } from "react-router-dom";
import CompartirTaller from "./compartirTaller";
import { ViewArray } from "@material-ui/icons";
import InformaciónTaller from "./infoTaller";
import VistaAprendizajes from "./Aprendizajes/vista_aprendizajes";
import AlumnosRegistrados from "./Usuarios/alumnos_registrados";

const useStyles = makeStyles((theme) => ({
  color: {
    backgroundColor: theme.palette.background.paper,
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function RegistroTaller(props) {
  const idcurso = props.match.params.curso;
  const { datos, update, setUpdate } = useContext(CursoContext);
  const token = localStorage.getItem("token");
  const [value, setValue] = useState(0);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [datosTaller, setDatosTaller] = useState({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const obtenerCursoBD = useCallback(async () => {
    setLoading(true);
    await clienteAxios
      .get(`/course/${idcurso}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        if (!res.data.taller) {
          return;
        } else {
          setDatosTaller(res.data.taller);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setSnackbar({
            open: true,
            mensaje: err.response.data.message,
            status: "error",
          });
        } else {
          setSnackbar({
            open: true,
            mensaje: "Al parecer no se a podido conectar al servidor.",
            status: "error",
          });
        }
      });
  }, [idcurso, token]);

  const publicarCurso = async () => {
    await clienteAxios
      .put(
        `/taller/publicTaller/${idcurso}`,
        {
          publicTaller: !datos?.taller.publicTaller,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
        setLoading(false);
        setUpdate(!update);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setSnackbar({
            open: true,
            mensaje: err.response.data.message,
            status: "error",
          });
        } else {
          setSnackbar({
            open: true,
            mensaje: "Al parecer no se a podido conectar al servidor.",
            status: "error",
          });
        }
      });
  };

  useEffect(() => {
    obtenerCursoBD();
  }, [obtenerCursoBD]);

  return (
    <Box p={3} mb={6} boxShadow={3} className={classes.color}>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Spin loading={loading} />
      <Box mb={2}>
        <Grid container justify="flex-end" spacing={2}>
          <Grid item>
            <Button
              target="_blank"
              fullWidth
              color="primary"
              variant="text"
              size="large"
              style={{ fontSize: 16 }}
              component={Link}
              to={`/curso_taller/${datos?.slug}`}
              onClick={() => {
                localStorage.setItem("vistaPrevia", true);
              }}
              startIcon={<ViewArray />}
            >
              Vista previa
            </Button>
          </Grid>
          <Grid item>
            <CompartirTaller datosTaller={datosTaller} />
          </Grid>
          <Grid item>
            <Button
              fullWidth
              color={
                datos?.taller?.publicTaller === true ? "primary" : "default"
              }
              variant="text"
              size="small"
              style={{ fontSize: 16 }}
              onClick={() => publicarCurso()}
              startIcon={
                <FormControlLabel
                  style={{ width: 40 }}
                  control={
                    <Switch
                      color="primary"
                      checked={datos?.taller?.publicTaller}
                      name="checkedA"
                    />
                  }
                />
              }
            >
              {datos?.taller?.publicTaller === true ? "Publicado" : "Publicar"}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <div className={classes.root}>
        <AppBar position="static" color="inherit" elevation={0}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="Información del taller" {...a11yProps(0)} />
            <Tab label="Aprendizajes" {...a11yProps(1)} />
            <Tab label="Usuarios registrados" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <InformaciónTaller idcurso={idcurso} datosTaller={datosTaller} setDatosTaller={setDatosTaller} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <VistaAprendizajes />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <AlumnosRegistrados idcurso={idcurso} />
        </TabPanel>
      </div>
    </Box>
  );
}
