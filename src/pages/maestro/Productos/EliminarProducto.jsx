import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { CircularProgress, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import clienteAxios from "../../../config/axios";

export default function EliminarProducto({ data, setUpdate, setSnackbar }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  let token = localStorage.getItem("token");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    await clienteAxios
      .delete(`/product/action/${data._id}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
        setLoading(false);
        setUpdate((update) => !update);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        handleClose();
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
      <IconButton onClick={handleClickOpen}>
        <Delete />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Se va a eliminar: {data.name}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            startIcon={
              loading ? <CircularProgress size="small" color="inherit" /> : null
            }
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
