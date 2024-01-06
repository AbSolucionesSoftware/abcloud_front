import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { CircularProgress, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import jwt_decode from "jwt-decode";
import clienteAxios from "../../../../config/axios";
import MessageSnackbar from "../../../../components/Snackbar/snackbar";
import { ComentariosCursoCtx } from "../../../../context/comentariosCursoCtx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EliminarRespuesta({ data, index }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { reply, setReply } = React.useContext(ComentariosCursoCtx);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    mensaje: "",
    status: "",
  });
  const token = localStorage.getItem("token");

  if (!token) return null;
  const usuario = jwt_decode(token);
  if (!usuario) return null;
  if (usuario._id !== data.idUser._id) return null;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteReply = async () => {
    setLoading(true);
    await clienteAxios
      .delete(
        `/comment/answerQualification/delete/${usuario._id}/${data._id}`,
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
        let data = [...reply.data];
        data.splice(index, 1);
        setReply((prev) => ({
          ...prev,
          data,
        }));
        setLoading(false);
        handleClose();
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setSnackbar({
            open: true,
            mensaje: err.response.data.message
              ? err.response.data.message
              : err.message,
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
    <>
      <IconButton onClick={handleClickOpen}>
        <Delete />
      </IconButton>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogTitle>
          {"¿Segúro que quieres eliminar tu respuesta?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            cancelar
          </Button>
          <Button
            onClick={handleDeleteReply}
            style={{color: "red"}}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
