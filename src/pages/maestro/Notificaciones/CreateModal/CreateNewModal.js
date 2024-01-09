import React, { useState, useContext, Fragment } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import EditIcon from "@material-ui/icons/Edit";
import SendIcon from "@material-ui/icons/Send";
import { Grid } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import clienteAxios from "../../../../config/axios";
import { NotificationCursoContext } from "../../../../context/NotificationCursoCtx";
import InputImageDev from "./InputImageDev";
import InputImage from "./InputImage";
import urlPage from "../../../../config/url";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateNewModal({ datos, isEditing }) {
  const { update, setUpdate, setSnackbar } = useContext(
    NotificationCursoContext
  );
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("student"));
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [preview, setPreview] = useState("");
  const [previewDevices, setPreviewDevices] = useState("");
  const [error, setError] = useState(false);
  const [values, setValues] = useState({
    title: "",
    description: "",
    image: "",
    image_devices: "",
    url: "",
  });

  const clearFields = () => {
    setValues({
      title: "",
      description: "",
      image: "",
      url: "",
      image_devices: "",
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
      setPreviewDevices(datos.image_devices);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    handleCloseConfirm();
    clearFields();
  };

  const getFields = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const sendNotification = async (sended) => {
    if (!values.title || !values.description || !preview || !previewDevices) {
      setError(true);
      return;
    }
    const formData = new FormData();
    [...values.image, ...values.image_devices].forEach((image) => {
      formData.append("images", image);
    });
    formData.append("title", values.title);
    formData.append("description", values.description);
    /*     formData.append("images", images); */
    formData.append("url", values.url);
    formData.append("admin", true);
    formData.append("isModal", true);
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
        .post(`/notification/modal/${user._id}`, formData, {
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
          startIcon={<InsertPhotoIcon />}
        >
          Nuevo modal
        </Button>
      )}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="dialog-notification"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="dialog-notification">Nuevo modal</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <InputImage
                values={values}
                setValues={setValues}
                preview={preview}
                setPreview={setPreview}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <InputImageDev
                values={values}
                setValues={setValues}
                previewDevices={previewDevices}
                setPreviewDevices={setPreviewDevices}
              />
            </Grid>
          </Grid>
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
            rows={4}
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
              {/* <Button
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
              </Button> */}
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
  handleClose,
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
