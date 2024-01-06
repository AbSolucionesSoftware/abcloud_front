import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import { Add, Done } from "@material-ui/icons";
import clienteAxios from "../../../../config/axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CrearSubCategoriaNuevoCurso({
  categorias,
  update,
  setUpdate,
  setSnackbar,
  datos,
  setDatos,
}) {
  const [open, setOpen] = React.useState(false);
  const [subCategorie, setSubCategorie] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChangeSubcategory = (value) => {
    const categoria = capitalizarPrimeraLetra(value);
    setSubCategorie(categoria);
  };

  function capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleSubmit = async () => {
    //verificar subcategorias vacias
    const category = categorias.filter(
      (res) => res.categorie === datos.category
    );
    if (!subCategorie) return;
    if (category.length === 0) return;
    setLoading(true);
    await clienteAxios
      .post(
        `/categories/subcategories/${category[0]._id}`,
        { subCategorie },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
        setDatos({
          ...datos,
          subCategory: subCategorie,
        });
        setSubCategorie("");
        setUpdate(!update);
        handleClose();
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
    <div>
      <IconButton
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        disabled={!datos.category}
      >
        <Add />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        aria-labelledby="new-category"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="new-category">Nueva categoria</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            label="Subcategoria"
            variant="outlined"
            onChange={(e) => onChangeSubcategory(e.target.value)}
            value={subCategorie}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button
            disabled={loading}
            onClick={() => handleSubmit()}
            color="primary"
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
        </DialogActions>
      </Dialog>
    </div>
  );
}
