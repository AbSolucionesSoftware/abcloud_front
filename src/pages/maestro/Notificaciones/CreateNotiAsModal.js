import React, { Fragment, useContext, useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import { NotificationCursoContext } from "../../../context/NotificationCursoCtx";
import clienteAxios from "../../../config/axios";

export default function CreateNotificationAsModal({ datos }) {
  const [loading, setLoading] = useState(false);
  const { update, setUpdate, setSnackbar } = useContext(
    NotificationCursoContext
  );
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");

  const checkNotification = async (confirmar) => {
    if (datos.sended && !confirmar) {
      setOpen(true);
      return;
    }
    setLoading(true);
    await clienteAxios
      .put(
        `/notification/${datos._id}/modal`,
        {},
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
        setLoading(false);
        setOpen(false);
        setUpdate(!update);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          console.log(err.response);
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

  return loading ? (
    <CircularProgress size={20} color="secondary" />
  ) : (
    <Fragment>
      <Checkbox
        checked={datos.isModal}
        onChange={() => checkNotification(false)}
        inputProps={{ "aria-label": "primary checkbox" }}
      />
      <Dialog
        open={open}
        keepMounted
        onClose={() => setOpen(false)}
        aria-labelledby="dialog-notification-modal"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="dialog-notification-modal">
          ¿Crear esta notificacion como Modal?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción pondrá como NO ENVIADA esta notificación y sera
            eliminada en el centro de notificaciones del usuario
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={() => checkNotification(true)}
            color="primary"
            startIcon={
              loading ? <CircularProgress color="inherit" size={20} /> : null
            }
          >
            Hacer modal esta noticiación
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
