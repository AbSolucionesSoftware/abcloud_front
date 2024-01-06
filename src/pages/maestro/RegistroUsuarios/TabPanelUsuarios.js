import React, { useCallback, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import VistaRegistroInstructores from "./Instructores/vista_registro";
import VistaRegistroEstudiantes from "./Estudiantes/VistaEstudiantes";
import {
  UsuariosDashCtx,
  UsuariosDashProvider,
} from "../../../context/usuariosAdminCtx";
import Spin from "../../../components/Spin/spin";
import MessageSnackbar from "../../../components/Snackbar/snackbar";
import clienteAxios from "../../../config/axios";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
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
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    width: "500",
  },
}));

export default function RegistroUsuariosUniline(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const token = localStorage.getItem("token");

  let user = { _id: "", name: "", imagen: "" };
  if (token !== null) user = JSON.parse(localStorage.getItem("student"));

  if (!token || !user || user.admin !== true)
    props.history.push("/instructor/cursos");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Estudiantes" {...a11yProps(0)} />
          <Tab label="Instructores" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <UsuariosDashProvider>
        <ContainerTabs value={value} />
      </UsuariosDashProvider>
    </div>
  );
}

const ContainerTabs = ({ value }) => {
  const token = localStorage.getItem("token");
  const {
    setMaestros,
    setUsuarios,
    setSnackbar,
    snackbar,
    loading,
    setLoading,
    reload,
    busqueda,
  } = useContext(UsuariosDashCtx);

  const obtenerInstructoresBD = useCallback(async () => {
    setLoading(true);
    await clienteAxios
      .get(`/user/action/teacher/`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setMaestros(res.data);
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
  }, [token, setLoading, setMaestros, setSnackbar]);

  const obtenerUsuariosBD = useCallback(async () => {
    if(!busqueda){
      setUsuarios([]);
      return
    }
    setLoading(true);
    await clienteAxios
      .get(`/user?search=${busqueda}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setUsuarios(res.data);
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
  }, [token, setLoading, setSnackbar, setUsuarios, busqueda]);

  useEffect(() => {
    obtenerInstructoresBD();
  }, [obtenerInstructoresBD, reload]);

  useEffect(() => {
    obtenerUsuariosBD();
  }, [obtenerUsuariosBD]);

  return (
    <Box mt={2}>
      <Spin loading={loading} />
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <TabPanel value={value} index={0}>
        <VistaRegistroEstudiantes />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <VistaRegistroInstructores />
      </TabPanel>
    </Box>
  );
};
