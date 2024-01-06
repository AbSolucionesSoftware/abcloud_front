import React, { useContext, useEffect, useState } from "react";

import {
  Box,
  Button,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
/* import SaveIcon from '@material-ui/icons/Save'; */
import AddIcon from "@material-ui/icons/Add";

import Aprendizajes from "./aprendizajes";
import Scroll from "../../../../../../components/ScrolltoTop/scroll";
import MessageSnackbar from "../../../../../../components/Snackbar/snackbar";
import Spin from "../../../../../../components/Spin/spin";
import { CursoContext } from "../../../../../../context/curso_context";
import clienteAxios from "../../../../../../config/axios";
import { Done } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  color: {
    backgroundColor: theme.palette.background.paper,
  },
  select: {
    width: "100%",
    margin: "8px 0",
  },
  margin: {
    margin: theme.spacing(1),
  },
  iconSave: {
    zIndex: 10,
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(10),
  },
  BoxActions: {
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.background.paper,
    zIndex: 10,
    position: "fixed",
    bottom: theme.spacing(0),
    right: theme.spacing(0),
    width: "100%",
  },
  editor: {
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      width: 320,
    },
  },
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
    "& .obligatorio": {
      color: "red",
    },
  },
  formInput: {
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
}));

export default function VistaAprendizajes() {
  const { datos, update, setUpdate } = useContext(CursoContext);
  const token = localStorage.getItem("token");
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  const [respuestaAprendizaje, setRespuestaAprendizaje] = useState("");
  const [datosAprendizajes, setDatosAprendizajes] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  const obtenerRespuesta = (e) => {
    setRespuestaAprendizaje(e.target.value);
  };

  const agregarRespuesta = () => {
    if (!respuestaAprendizaje) {
      return;
    }
    setDatosAprendizajes([
      ...datosAprendizajes,
      { apredizaje: respuestaAprendizaje },
    ]);
    setRespuestaAprendizaje("");
  };

  useEffect(() => {
    if (datos.taller?.aprendizajesTaller) {
      setDatosAprendizajes(datos.taller.aprendizajesTaller);
    }
  }, [datos]);

  const eliminarRespuesta = (index) => {
    datosAprendizajes.splice(index, 1);
    setDatosAprendizajes([...datosAprendizajes]);
  };

  const guardarDatosBD = async () => {
    if (datosAprendizajes.length === 0) {
      setSnackbar({
        open: true,
        mensaje: "Por agregue minimo un aprendizaje",
        status: "error",
      });
      return;
    }
    setLoading(true);
    await clienteAxios
      .put(
        `/taller/agregateAprendizajes/${datos._id}`,
        {
          aprendizajesTaller: datosAprendizajes,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setUpdate(!update);
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
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

  return (
    <Box mt={3} mb={4} /* p={5} boxShadow={5} className={classes.color} */>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Spin loading={loading} />
      {/* <div>
				<Button
					variant="contained"
					color="primary"
					aria-label="Guardar"
					className={classes.iconSave}
					onClick={() => guardarDatosBD()}
				>
					<SaveIcon className={classes.margin} />
					Guardar
				</Button>
				<Scroll showBelow={250} />
			</div> */}
      <Scroll showBelow={250} bottomMargin={78} />
      <Box className={classes.BoxActions} boxShadow={3}>
        <Button
          size="large"
          variant="contained"
          color="primary"
          aria-label="Guardar"
          /* className={classes.iconSave} */
          onClick={() => guardarDatosBD()}
          startIcon={<Done />}
        >
          Guardar
        </Button>
      </Box>
      <Grid item xs={12} md={12} sm={4} lg={6}>
        <Typography variant="h6">
          ¿Qué aprenderan los estudiantes en tu taller?
        </Typography>
      </Grid>
      <Box>
        <Box my={2}>
          <Aprendizajes
            datosAprendizajes={datosAprendizajes}
            eliminarRespuesta={eliminarRespuesta}
            setDatosAprendizajes={setDatosAprendizajes}
          />
          <TextField
            name="aprendizajesTaller"
            fullWidth
            placeholder="Ejemplo: HTML básico"
            variant="outlined"
            value={respuestaAprendizaje}
            onChange={obtenerRespuesta}
          />
        </Box>
        <Box mt={2}>
          <Button
            startIcon={<AddIcon />}
            color="primary"
            onClick={() => agregarRespuesta("aprendizajesTaller")}
          >
            Agregar respuesta
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
