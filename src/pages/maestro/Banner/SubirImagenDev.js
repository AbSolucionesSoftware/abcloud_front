import React, { Fragment, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useDropzone } from "react-dropzone";
import clienteAxios from "../../../config/axios";
import MessageSnackbar from "../../../components/Snackbar/snackbar";

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

export default function SubirImagenBannerDevices({
  banner,
  update,
  setUpdate,
  values,
  setValues,
  view,
  preview,
  setPreview,
}) {
  const classes = useStyles();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  const onDrop = useCallback(
    (files) => {
      setPreview(URL.createObjectURL(files[0]));
      setValues({
        ...values,
        image_devices: files[0],
      });
    },
    [values, setValues, setPreview]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const subirImagen = async () => {
    if (!values.image_devices || !preview) {
      return;
    } else if (
      preview &&
      preview.includes("https://cursos-uniline.s3.us-west-1.amazonaws.com")
    ) {
      return;
    }
    const formData = new FormData();
    formData.append("imagen", values.image_devices);
    setLoading(true);
    await clienteAxios
      .put(`/banner/image_devices/${banner._id}`, formData, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
        setLoading(false);
        setUpdate(!update);
      })
      .catch((err) => {
        console.log(err);
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
      <Box
        className={classes.dropZone}
        {...getRootProps()}
        height={120}
        display="flex"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <input {...getInputProps()} disabled={view === "nuevo"} />
        {values.image_devices || preview ? (
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
      {view !== "nuevo" ? (
        <Fragment>
          <Box my={2}>{loading ? <LinearProgress /> : null}</Box>
          <Box display="flex" justifyContent="flex-end">
            <Button
              color="primary"
              variant="contained"
              size="small"
              disabled={loading || !preview}
              onClick={() => subirImagen()}
            >
              Guardar
            </Button>
            <Box mx={1} />
            <EliminarImagenDevices
              setSnackbar={setSnackbar}
              banner={banner}
              update={update}
              setUpdate={setUpdate}
            />
          </Box>
        </Fragment>
      ) : null}
    </Fragment>
  );
}

const EliminarImagenDevices = ({ setSnackbar, banner, update, setUpdate }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    await clienteAxios
      .delete(`/banner/image_devices/${banner._id}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
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
      <Button
        color="secondary"
        variant="outlined"
        size="small"
        disabled={!banner.key_devices}
        onClick={handleClickOpen}
      >
        Eliminar
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
      >
        <DialogTitle>¿Está seguro de eliminar esto?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="secondary"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress color="inherit" size={18} /> : null
            }
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
