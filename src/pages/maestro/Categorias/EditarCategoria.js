import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { Done, Edit } from "@material-ui/icons";
import clienteAxios from "../../../config/axios";
import MessageSnackbar from "../../../components/Snackbar/snackbar";
import { CircularProgress } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditarCategoria({ categoria, setUpdate, update }) {
  const [open, setOpen] = useState(false);
  const [categorie, setCategorie] = useState(categoria.categorie);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChangeCategorie = (e) => {
    const categorie = capitalizarPrimeraLetra(e.target.value);
    setCategorie(categorie);
  };

  function capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleSubmit = async () => {
    setLoading(true);
    await clienteAxios
      .put(
        `/categories/${categoria._id}`,
        { categorie },
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
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <IconButton
        aria-label="expand row"
        size="medium"
        onClick={handleClickOpen}
      >
        <Edit />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogTitle>Editar categoria</DialogTitle>
        <DialogContent>
          <TextField
            label="Categoria"
            variant="outlined"
            style={{ width: "330px" }}
            onChange={onChangeCategorie}
            value={categorie}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button
            disabled={loading}
            onClick={handleSubmit}
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
