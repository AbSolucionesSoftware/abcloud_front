import React, { Fragment, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import { Alert, AlertTitle } from "@material-ui/lab";
import clienteAxios from "../../../config/axios";

import SubirImagenBannerDesk from "./SubirImagenDesk";
import { CircularProgress } from "@material-ui/core";
import SubirImagenBannerDevices from "./SubirImagenDev";
import urlPage from "../../../config/url";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CrearBanner({
  banner,
  update,
  setUpdate,
  view,
  courses,
  last_banner,
  setSnackbar,
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    course_ref: "",
    course_name: "",
  });
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [preview_devices, setPreviewDevices] = useState("");

  const cleanData = () => {
    setValues({
      course_ref: "",
      course_name: "",
    });
    setPreview("");
  };

  const handleClickOpen = () => {
    setOpen(true);
    if (view === "editar" && banner) {
      setValues(banner);
      setPreview(banner.image_desktop);
      if (banner.key_devices) {
        setPreviewDevices(banner.image_devices);
      }
    }
  };

  const handleClose = () => {
    cleanData();
    setOpen(false);
  };

  const handleSelect = (e, child) => {
    setValues({
      ...values,
      course_ref: child.props.course ? child.props.course.slug : "",
      course_name: e.target.value,
    });
  };

  const crearBannerBD = async () => {
    if (!values.image_desktop) {
      return;
    }
    const formData = new FormData();
    if (view === "nuevo") {
      formData.append("course_ref", values.course_ref);
      formData.append("course_name", values.course_name);
      formData.append("imagen", values.image_desktop);
      formData.append("order_number", last_banner + 1);
    }
    setLoading(true);
    if (view === "nuevo") {
      await clienteAxios
        .post("/banner/", formData, {
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
    } else {
      await clienteAxios
        .put(
          `/banner/${banner._id}`,
          {
            course_name: values.course_name,
            course_ref: values.course_ref,
          },
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
          setLoading(false);
          setUpdate(!update);
          handleClose();
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
    }
  };

  return (
    <Fragment>
      {view === "nuevo" ? (
        <Button
          aria-label="nuevo"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Nuevo banner
        </Button>
      ) : (
        <IconButton aria-label="edit" color="default" onClick={handleClickOpen}>
          <EditIcon />
        </IconButton>
      )}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {view === "nuevo" ? "Registrar nuevo banner" : "Editar banner"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <Box>
                <Alert severity="info" icon={false}>
                  <AlertTitle>Banner normal</AlertTitle>
                  Este baner aparecera en computadoras y laptops
                </Alert>
              </Box>
              <SubirImagenBannerDesk
                banner={banner}
                setUpdate={setUpdate}
                update={update}
                setValues={setValues}
                values={values}
                view={view}
                preview={preview}
                setPreview={setPreview}
              />
            </Grid>
            <Grid item md={6}>
              <Box>
                <Alert severity="info" icon={false}>
                  <AlertTitle>Para dispositivos moviles</AlertTitle>
                  Este aparecera en dispositivos como tablets y smartphones
                </Alert>
              </Box>
              <SubirImagenBannerDevices
                banner={banner}
                setUpdate={setUpdate}
                update={update}
                setValues={setValues}
                values={values}
                view={view}
                preview={preview_devices}
                setPreview={setPreviewDevices}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel id="select-curso-ref">Curso</InputLabel>
                <Select
                  labelId="select-curso-ref"
                  id="select-curso"
                  value={values.course_name}
                  onChange={(e, child) => handleSelect(e, child)}
                  label="Curso"
                >
                  <MenuItem value="">
                    <em>Ninguno</em>
                  </MenuItem>
                  {courses.map((res, index) => (
                    <MenuItem key={index} value={res.title} course={res}>
                      {res.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Enlace de redireccion"
                variant="outlined"
                size="small"
                fullWidth
                disabled
                InputProps={{
                  startAdornment: `${urlPage}/curso/`,
                }}
                value={values.course_ref}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={() => crearBannerBD()}
            color="primary"
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress color="inherit" size={18} />
              ) : (
                <AddIcon />
              )
            }
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
