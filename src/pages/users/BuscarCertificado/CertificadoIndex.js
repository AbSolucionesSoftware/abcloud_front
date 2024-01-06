import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Search, School } from "@material-ui/icons";
import TablaCertificados from "./TablaCertificados";
import clienteAxios from "../../../config/axios";
import { CircularProgress, Divider, Typography } from "@material-ui/core";
import MessageSnackbar from "../../../components/Snackbar/snackbar";
import UbicacionNumeroCertificado from "./UbicacionNumeroCer";
import ULogo from "../../../images/u-normal.png";

export default function BuscarUnCertificado() {
  const [certificado, setCertificado] = useState();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

  const obtenerCertificado = async (e) => {
    e.preventDefault();
    if (!value) return;
    const numero_certificado = value.trim();
    setLoading(true);
    await clienteAxios
      .get(`/certificate/verify/${numero_certificado}`)
      .then((res) => {
        setLoading(false);
        setCertificado(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response) {
          console.log(err);
        } else {
          setSnackbar({
            open: true,
            mensaje: "Al parecer no se a podido conectar al servidor.",
            status: "error",
          });
        }
      })
      .finally((e) => {
        setLoaded(true);
      });
  };

  return (
    <Container maxWidth="md">
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Box my={5}>
        <Box display="flex" my={3}>
          <Box
            height="64px"
            width="64px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <img
              alt="logo-uniline"
              src={ULogo}
              style={{ maxHeight: "100%", maxWidth: "100%" }}
            />
          </Box>
          <Box mx={2} mb={2}>
            <Typography variant="h5">Verificación de certificados</Typography>
            <Typography variant="h6">Cursos UNILINE</Typography>
          </Box>
        </Box>

        <Divider />
        <Box mb={2} mt={1}>
          <Typography>
            En el siguiente recuadro, deberás escribir el{" "}
            <b>Número de certificado</b> que deseas verificar
          </Typography>
          <UbicacionNumeroCertificado />
        </Box>
        <Box>
          <Paper variant="outlined" style={{ width: "400px", border: 0 }}>
            <form onSubmit={(e) => obtenerCertificado(e)}>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Introduce un número de certificado"
                fullWidth
                onChange={(e) => setValue(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <School color="disabled" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton disabled={loading} type="submit">
                        {loading ? <CircularProgress size={28} /> : <Search />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Paper>
        </Box>
      </Box>
      <Box my={2}>
        <TablaCertificados loaded={loaded} certificado={certificado} />
      </Box>
    </Container>
  );
}
