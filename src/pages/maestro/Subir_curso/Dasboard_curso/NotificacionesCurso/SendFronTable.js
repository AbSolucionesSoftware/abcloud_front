import React, { Fragment, useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import CircularProgress from "@material-ui/core/CircularProgress";
import SendIcon from "@material-ui/icons/Send";
import clienteAxios from "../../../../../config/axios";
import { NotificationCursoContext } from "../../../../../context/NotificationCursoCtx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EnviarNotificacion({ datos }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { update, setUpdate, setSnackbar } = useContext(
    NotificationCursoContext
  );
  const token = localStorage.getItem("token");

  const sendNotification = async () => {
    setLoading(true);
    await clienteAxios
      .put(`/notification/send/${datos._id}`, {},{
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <IconButton
        onClick={() => handleClickOpen()}
        disabled={datos.sended}
        size="small"
        color="secondary"
      >
        <SendIcon />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Se enviará esta notificación
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={() => sendNotification()}
            color="secondary"
            startIcon={
              loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <SendIcon />
              )
            }
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
