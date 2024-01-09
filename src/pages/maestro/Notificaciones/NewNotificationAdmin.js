import React, { useState, useCallback, useContext, Fragment } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import SendIcon from "@material-ui/icons/Send";
import DoneIcon from "@material-ui/icons/Done";
import {makeStyles } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { useDropzone } from "react-dropzone";
import clienteAxios from "../../../config/axios";
import AddAlertIcon from '@material-ui/icons/AddAlert';
import { NotificationCursoContext } from "../../../context/NotificationCursoCtx";
import urlPage from "../../../config/url";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  imagen: {
    maxHeight: "100%",
    maxWidth: "100%",
  },
  dropZone: {
    border: "dashed 2px",
    borderColor: "#aaaaaa",
  },
}));

export default function NewNotificationAdmin({ datos, isEditing }) {
  const { update, setUpdate, setSnackbar } = useContext(
    NotificationCursoContext
  );
  const classes = useStyles();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("student"));
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState(false);
  const [values, setValues] = useState({
    title: "",
    description: "",
    image: "",
    url: "",
  });

  const clearFields = () => {
    setValues({
      title: "",
      description: "",
      image: "",
      url: "",
    });
  };

  const handleClickOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleClickOpen = () => {
    if (isEditing) {
      setValues(datos);
      setPreview(datos.image);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    handleCloseConfirm();
    clearFields();
  };


  const onDrop = useCallback(
    (files) => {
      setPreview(URL.createObjectURL(files[0]));
      setValues({
        ...values,
        image: files[0],
      });
    },
    [values, setValues, setPreview]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const getFields = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const removeImage = () => {
    setValues({
      ...values,
      image: "",
    });
    setPreview("");
  };

  const sendNotification = async (sended) => {
    if (!values.title || !values.description) {
      setError(true);
      return;
    }
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("imagen", values.image);
    formData.append("url", values.url);
    formData.append("admin", true);
    formData.append("isModal", values.isModal ? values.isModal : false);
    formData.append("general", true);
    formData.append("sended", sended);
    formData.append("id_course", "");
    formData.append("id_teacher", "");
    formData.append("teacher_name", "AB Cloud");

    if (sended) {
      setLoadingSend(true);
    } else {
      setLoadingSave(true);
    }
    if (!isEditing) {
      await clienteAxios
        .post(`/notification/${user._id}`, formData, {
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
          setLoadingSend(false);
          setLoadingSave(false);
          setUpdate(!update);
          handleClose();
        })
        .catch((err) => {
          setLoadingSend(false);
          setLoadingSave(false);
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
    } else {
      await clienteAxios
        .put(`/notification/${datos._id}`, formData, {
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
          setLoadingSend(false);
          setLoadingSave(false);
          setUpdate(!update);
          handleClose();
        })
        .catch((err) => {
          setLoadingSend(false);
          setLoadingSave(false);
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
    }
  };

  return (
    <div>
      {isEditing ? (
        <IconButton
          size="small"
          variant="text"
          color="secondary"
          onClick={handleClickOpen}
        >
          <EditIcon />
        </IconButton>
      ) : (
        <Button
          variant="text"
          color="primary"
          onClick={handleClickOpen}
          startIcon={<AddAlertIcon />}
        >
          Nueva notificacion
        </Button>
      )}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="dialog-notification"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="dialog-notification">Nueva notificación</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" flexDirection="column">
            <Box
              className={preview ? "" : classes.dropZone}
              {...getRootProps()}
              height={120}
              width="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
            >
              <input {...getInputProps()} />
              {values.image || preview ? (
                <Box
                  height={120}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <img
                    alt="imagen del curso"
                    src={preview}
                    className={classes.imagen}
                  />
                </Box>
              ) : isDragActive ? (
                <Typography>Suelta tú imagen aquí...</Typography>
              ) : (
                <Typography>
                  haz clic aquí o arrastra tu imagen y suelta aquí
                </Typography>
              )}
            </Box>
            <Button
              fullWidth
              variant="text"
              color="primary"
              size="small"
              onClick={() => removeImage()}
            >
              Eliminar imagen
            </Button>
          </Box>
          <Box mb={1} />
          <TextField
            label="Titulo"
            fullWidth
            variant="outlined"
            name="title"
            onChange={getFields}
            value={values.title}
            error={error && !values.title}
          />
          <Box mb={1} />
          <TextField
            label="Descripción"
            fullWidth
            variant="outlined"
            name="description"
            onChange={getFields}
            value={values.description}
            multiline
            rows={5}
            error={error && !values.description}
          />
          <Box mb={1} />
          <TextField
            label="Link o enlace"
            fullWidth
            variant="outlined"
            name="url"
            onChange={getFields}
            value={values.url}
            placeholder={`${urlPage}/`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            {isEditing && datos.sended ? "Cerrar" : "Cancelar"}
          </Button>
          {isEditing && (datos.sended || datos.isModal) ? null : (
            <Fragment>
              <Button
                onClick={() => sendNotification(false)}
                color="primary"
                disabled={(isEditing && datos.sended) || loadingSend}
                startIcon={
                  loadingSave ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <DoneIcon />
                  )
                }
              >
                Guardar
              </Button>
              <AlertToSend
                isEditing={isEditing}
                datos={datos}
                loadingSave={loadingSave}
                loadingSend={loadingSend}
                sendNotification={sendNotification}
                open={openConfirm}
                handleClickOpen={handleClickOpenConfirm}
                handleClose={handleCloseConfirm}
              />
            </Fragment>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

const AlertToSend = ({
  isEditing,
  datos,
  loadingSave,
  loadingSend,
  sendNotification,
  open,
  handleClickOpen,
  handleClose
}) => {

  return (
    <Fragment>
      <Button
        onClick={() => handleClickOpen()}
        color="primary"
        disabled={(isEditing && datos.sended) || loadingSave}
        startIcon={
          loadingSend ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            <SendIcon />
          )
        }
      >
        Enviar
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="dialog-notification"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="dialog-notification">
          Estas apunto de enviar esta notificación
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={() => sendNotification(true)}
            color="primary"
            disabled={(isEditing && datos.sended) || loadingSave}
            startIcon={
              loadingSend ? (
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
};
