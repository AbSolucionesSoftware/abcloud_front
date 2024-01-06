import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import MessageSnackbar from "../../../components/Snackbar/snackbar";
import clienteAxios from "../../../config/axios";
import ChartVentas from "./ChartVentas";
import MontosGenerados from "./MontosGenerados";
import TotalVentasCounter from "./TotalVentasCounter";
import TablaVentasMaestro from "./TablaPagos/TablaVentas";
import TablaVentasCursos from "./TablaCursos/TablaVentasCursos";

export default function VentasMaestro() {
  let user = JSON.parse(localStorage.getItem("student"));
  let token = localStorage.getItem("token");
  const [counterGraphics, setGraphicsCounter] = useState({
    totalPays: 0,
    totalPaysSuccess: 0,
    failedsPays: 0,
    paypalPays: 0,
    stripePays: 0,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  let idUser = user || user !== null ? user._id : "";

  const errorMessage = (err) => {
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
  };

  const getCounterSalesDB = useCallback(async () => {
    await clienteAxios
      .get(`/sales/graphics/${idUser}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setGraphicsCounter(res.data);
      })
      .catch((err) => {
        errorMessage(err);
      });
  }, [token, idUser]);

  useEffect(() => {
    getCounterSalesDB();
  }, [getCounterSalesDB]);

  return (
    <Box>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Grid container spacing={2}>
        <Grid item lg={3} md={6} xs={12}>
          <TotalVentasCounter counterGraphics={counterGraphics} />
        </Grid>
        <Grid item lg={5} md={6} xs={12}>
          <ChartVentas counterGraphics={counterGraphics} />
        </Grid>
        <Grid item lg={4} md={12} xs={12}>
          <MontosGenerados counterGraphics={counterGraphics} />
        </Grid>
        <Grid item xs={12}>
          <TabsTables setSnackbar={setSnackbar} />
        </Grid>
      </Grid>
    </Box>
  );
}

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const TabsTables = ({setSnackbar}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Tabla de pagos" {...a11yProps(0)} />
        <Tab label="Tabla de cursos vendidos" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <TablaVentasMaestro setSnackbar={setSnackbar} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TablaVentasCursos setSnackbar={setSnackbar} />
      </TabPanel>
    </div>
  );
};


