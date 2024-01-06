import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  FormControlLabel,
  Grid,
  makeStyles,
  TextField,
  Typography,
  Link,
  DialogContent,
  DialogTitle,
  FormControl,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import clienteAxios from "../../config/axios";
import MessageSnackbar from "../../components/Snackbar/snackbar";
import Spin from "../../components/Spin/spin";

const useStyles = makeStyles((theme) => ({
  buttonInscripcion: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "bold",
    backgroundColor: "#EFB321",
    fontSize: 25,
  },
}));

export default function InscripcionTaller({ idCourse, taller, props }) {
  const [open, setOpen] = useState(false);
  const [datosUsuario, setDatosUsuario] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const onChange = (e) => {
    if (e.target.name === "politicas") {
      setDatosUsuario({
        ...datosUsuario,
        [e.target.name]: e.target.checked,
      });
    } else {
      setDatosUsuario({
        ...datosUsuario,
        [e.target.name]: e.target.value,
      });
    }
  };

  const inscripcionUsuario = async () => {
    if (
      !datosUsuario.nameUser ||
      !datosUsuario.emailUser ||
      !datosUsuario.politicas ||
      !datosUsuario.phoneUser
    ) {
      setSnackbar({
        open: true,
        mensaje: "Por favor llena todos los campos y acepta las politicas.",
        status: "error",
      });
      setError(true);
      return;
    }
    await clienteAxios
      .post(`/taller/usersTaller/${idCourse}`, {
        nameUser: datosUsuario.nameUser,
        emailUser: datosUsuario.emailUser,
        politicas: datosUsuario.politicas,
        phoneUser: datosUsuario.phoneUser,
      })
      .then((res) => {
        generarCorreo();
        setOpen(!open);
        props.history.push(`/register_user/inscrito`);
        // setDatosUsuario([]);
      })
      .catch((err) => {
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

  const generarCorreo = async () => {
    if (
      !datosUsuario.nameUser ||
      !datosUsuario.emailUser ||
      !datosUsuario.politicas ||
      !datosUsuario.phoneUser
    ) {
      setSnackbar({
        open: true,
        mensaje: "Por favor llena todos los campos y acepta las politicas.",
        status: "error",
      });
      setError(true);
      return;
    }
    await clienteAxios
      .post(`/taller/generateMail/`, {
        nameUser: datosUsuario.nameUser,
        emailUser: datosUsuario.emailUser,
        phoneUser: datosUsuario.phoneUser,
        message: taller?.infoCorreo ? taller.infoCorreo : "",
        linksCorreo: taller?.linksCorreo ? taller.linksCorreo : "",
      })
      .then((res) => {
        setLoading(false);
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
    <Box>
      <Spin loading={loading} />
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Box mt={2}>
        <Button
          variant="contained"
          className={classes.buttonInscripcion}
          startIcon={<EmojiObjectsIcon style={{ fontSize: 40 }} />}
          onClick={handleClickOpen}
        >
          Reservar mi espacio
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClickOpen} fullWidth maxWidth="xs">
        <DialogTitle>{`Registro a ${taller?.nameTaller}`}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                name="nameUser"
                id="nameUser"
                label="Nombre"
                variant="outlined"
                onChange={onChange}
                error={error && !datosUsuario.nameUser}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                name="emailUser"
                id="emailUser"
                label="Correo Electronico"
                variant="outlined"
                onChange={onChange}
                error={error && !datosUsuario.emailUser}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                name="phoneUser"
                id="phoneUser"
                label="Telefono"
                variant="outlined"
                onChange={onChange}
                error={error && !datosUsuario.phoneUser}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl error={error && !datosUsuario.politicas}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={onChange}
                      id="politicas"
                      name="politicas"
                      color="primary"
                    />
                  }
                  label={
                    <Typography>
                      <Link target="_blank" href="/politicas">
                        Acepto políticas y condiciones
                      </Link>
                    </Typography>
                  }
                />
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                size="small"
                startIcon={<MailOutlineIcon style={{ fontSize: 30 }} />}
                className={classes.buttonInscripcion}
                variant="contained"
                onClick={() => {
                  inscripcionUsuario();
                }}
              >
                Registrarme
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
