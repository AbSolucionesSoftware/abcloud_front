import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import CrearCategoria from "./CrearCategorias";
import ListaCategorias from "./ListaCategorias";
import Container from "@material-ui/core/Container";
import clienteAxios from "../../../config/axios";
import MessageSnackbar from "../../../components/Snackbar/snackbar";
import Spin from "../../../components/Spin/spin";
import { Hidden } from "@material-ui/core";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });
  const [update, setUpdate] = useState(false);

  const obtenerCategorias = async () => {
    setLoading(true);
    await clienteAxios
      .get("/categories/")
      .then((res) => {
        setCategorias(res.data);
        setLoading(false);
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
    obtenerCategorias();
  }, [update]);

  return (
    <Box>
      <Spin loading={loading} />
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Container maxWidth="sm">
        <Hidden smDown>
          <Box position="absolute" top={64} right={20}>
            <CrearCategoria update={update} setUpdate={setUpdate} />
          </Box>
        </Hidden>
        <Hidden mdUp>
          <Box display="flex" justifyContent="flex-end">
            <CrearCategoria update={update} setUpdate={setUpdate} />
          </Box>
        </Hidden>
        <Box my={2}>
          <ListaCategorias
            categorias={categorias}
            update={update}
            setUpdate={setUpdate}
          />
        </Box>
      </Container>
    </Box>
  );
}
