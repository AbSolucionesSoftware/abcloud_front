import React, { Fragment, useState } from "react";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Done } from "@material-ui/icons";
import clienteAxios from "../../../config/axios";
import MessageSnackbar from "../../../components/Snackbar/snackbar";

export default function CrearSubCategoria({ categoria, update, setUpdate }) {
  const [subCategorie, setSubCategorie] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  const onChangeSubcategory = (value) => {
    const categoria = capitalizarPrimeraLetra(value);
    setSubCategorie(categoria);
  };

  function capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleSubmit = async () => {
    //verificar subcategorias vacias
    if (!subCategorie) return;
    setLoading(true);
    await clienteAxios
      .post(
        `/categories/subcategories/${categoria._id}`,
        { subCategorie },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setSubCategorie("");
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
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

  return (
    <Fragment>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <TextField
            fullWidth
            size="small"
            label="Subcategoria"
            variant="outlined"
            onChange={(e) => onChangeSubcategory(e.target.value)}
            value={subCategorie}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <Button
            variant="text"
            color="primary"
            size="medium"
            onClick={handleSubmit}
            startIcon={
              loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <Done />
              )
            }
          >
            Guardar
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
}
