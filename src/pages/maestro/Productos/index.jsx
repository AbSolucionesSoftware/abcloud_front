import React from "react";
import SearchFilter from "./SearchFilter";
import NewProduct from "./NuevoProducto";
import TableProducts from "./TableProducts";
import { Box, Grid, Hidden } from "@material-ui/core";
import clienteAxios from "../../../config/axios";
import MessageSnackbar from "../../../components/Snackbar/snackbar";

export default function Productos() {
  const [filter, setFilter] = React.useState("");
  const [productos, setProductos] = React.useState([]);
  const [update, setUpdate] = React.useState([]);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    mensaje: "",
    status: "",
  });
  let user = JSON.parse(localStorage.getItem("student"));
  let token = localStorage.getItem("token");
  let idUser = user || user !== null ? user._id : "";

  const getProducts = React.useCallback(async () => {
    await clienteAxios
      .get(`/product/${idUser}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setProductos(res.data);
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
  }, [token, idUser]);

  React.useEffect(() => {
    getProducts();
  }, [getProducts, update]);

  return (
    <div>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Hidden smDown>
        <Box display="flex" position="absolute" top={64} right={20}>
          <SearchFilter filter={filter} setFilter={setFilter} />
          <Box ml={1} />
          <NewProduct setSnackbar={setSnackbar} setUpdate={setUpdate} />
        </Box>
      </Hidden>
      <Hidden mdUp>
        <Grid container spacing={1}>
          <Grid item xs={9}>
            <SearchFilter filter={filter} setFilter={setFilter} />
          </Grid>
          <Grid item xs={3}>
            <NewProduct setSnackbar={setSnackbar} setUpdate={setUpdate} />
          </Grid>
        </Grid>
      </Hidden>
      <TableProducts
        productos={productos}
        setUpdate={setUpdate}
        setSnackbar={setSnackbar}
      />
    </div>
  );
}
