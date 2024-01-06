import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import DialogTitle from "@material-ui/core/DialogTitle";
import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { Add, Edit } from "@material-ui/icons";
import { CircularProgress, Container, TextField } from "@material-ui/core";
import SeleccionarCurso from "./SelectCourses";
import ItemCourse from "./ItemCourse";
import { formatoMexico } from "../../../../config/reuserFunction";
import clienteAxios from "../../../../config/axios";
import MessageSnackbar from "../../../../components/Snackbar/snackbar";
import { PackageCtx } from "../PackagesCtx";
import ImagenInputPack from "./ImagenInputPack";

const initialState = {
  title: "",
  description: "",
  courses: [],
  active: true,
  pricePack: 0,
};

export default function CrearPackage({ updating, data = initialState }) {
  const token = localStorage.getItem("token");
  const student = JSON.parse(localStorage.getItem("student"));
  const {
    updateQuery,
    setSnackbar,
    setUpdateQuery,
    snackbar,
    packageObj,
    setPackage,
    setPreview,
  } = React.useContext(PackageCtx);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickOpen = () => {
    if (updating) {
      const { _id, idProfessor, createdAt, updatedAt, __v, ...datos } = {
        ...data,
      };
      setPackage(datos);
      setPreview(datos.image);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPackage({
      title: "",
      description: "",
      courses: [],
      active: true,
      pricePack: 0,
    });
    setPreview("");
    setLoading(false);
  };

  const onGetData = (e) => {
    const { name, value } = e.target;
    if (name === "slug") {
      setPackage({
        ...packageObj,
        slug: value.replace(" ", "-").toLowerCase(),
      });
      return;
    }
    setPackage({
      ...packageObj,
      [name]: value,
    });
  };

  const errorMessage = (err) => {
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
  };

  const onSendData = async () => {
    setLoading(true);
    if (!updating) {
      const datos = { ...packageObj, idProfessor: student._id };
      const formData = new FormData();
      formData.append("title", datos.title);
      formData.append("slug", datos.slug);
      formData.append("description", datos.description);
      formData.append("idProfessor", datos.idProfessor);
      formData.append("active", datos.active);
      formData.append("imagen", datos.image);
      formData.append("pricePack", datos.pricePack);
      formData.append("courses", JSON.stringify(datos.courses));

      await clienteAxios
        .post(`/packages/${student._id}`, formData, {
          headers: {
            Authorization: `bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setLoading(false);
          setSnackbar({
            open: true,
            mensaje: res.data.message,
            status: "success",
          });
          setUpdateQuery(!updateQuery);
          setLoading(false);
          handleClose();
        })
        .catch((err) => {
          setLoading(false);
          errorMessage(err);
        });
    } else {
      const datos = { ...packageObj };
      const formData = new FormData();
      formData.append("title", datos.title);
      formData.append("slug", datos.slug);
      formData.append("description", datos.description);
      formData.append("active", datos.active);
      formData.append("imagen", datos.image);
      formData.append("key_image", datos.key_image);
      formData.append("pricePack", datos.pricePack);
      formData.append("courses", JSON.stringify(datos.courses));
      await clienteAxios
        .put(`/packages/update/${data._id}`, formData, {
          headers: {
            Authorization: `bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setLoading(false);
          setSnackbar({
            open: true,
            mensaje: res.data,
            status: "success",
          });
          setUpdateQuery(!updateQuery);
        })
        .catch((err) => {
          setLoading(false);
          errorMessage(err);
        });
    }
  };

  return (
    <div>
      {updating ? (
        <Button
          variant="text"
          color="primary"
          startIcon={<Edit />}
          size="small"
          onClick={() => handleClickOpen()}
        >
          Editar
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          disableElevation
          startIcon={<Add />}
          onClick={() => handleClickOpen()}
        >
          Nuevo
        </Button>
      )}
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="new-package-tile"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="new-package-tile">
          {updating ? "Editar paquete" : "Crear nuevo paquete"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Container maxWidth="xs">
                <ImagenInputPack />
              </Container>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="titulo"
                name="title"
                variant="outlined"
                size="small"
                fullWidth
                value={packageObj.title}
                onChange={onGetData}
              />
              <Box my={1} />
              <TextField
                label="slug"
                name="slug"
                variant="outlined"
                size="small"
                fullWidth
                value={packageObj.slug}
                onChange={onGetData}
              />
              <Box my={1} />
              <TextField
                label="descripción"
                name="description"
                variant="outlined"
                multiline
                rows={4}
                rowsMax={4}
                size="small"
                fullWidth
                value={packageObj.description}
                onChange={onGetData}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <FormControlLabel
                  control={
                    <Switch
                      checked={packageObj.active}
                      /* onChange={handleChange} */
                      name="active"
                    />
                  }
                  label={`Paquete activo o inactivo`}
                />
                <SeleccionarCurso />
              </Box>
              <Box mt={1} height={220} style={{ overflowY: "auto" }}>
                {packageObj.courses.map((res, index) => (
                  <ItemCourse key={index} course={res} index={index} />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Box width="100%">
            <Box my={1} mr={2}>
              <Divider />
              <Box display="flex" justifyContent="flex-end">
                <Typography>
                  <b>{`Precio total: $${formatoMexico(
                    packageObj.pricePack
                  )}`}</b>
                </Typography>
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Button onClick={handleClose} color="inherit">
                Cancelar
              </Button>
              <Box mx={1} />
              <Button
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Add />
                  )
                }
                disabled={loading}
                onClick={onSendData}
                color="primary"
                autoFocus
              >
                {updating ? "Actualizar" : "Crear"}
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
}
