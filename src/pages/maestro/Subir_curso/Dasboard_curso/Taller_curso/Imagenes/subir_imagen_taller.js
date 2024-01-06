import React, { Fragment, useState, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";
/* import { CursoContext } from '../../../../../context/curso_context'; */
import { useDropzone } from "react-dropzone";
import clienteAxios from "../../../../../../config/axios";
import MessageSnackbar from "../../../../../../components/Snackbar/snackbar";
import { withRouter } from "react-router-dom";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

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

function SubirImagenTaller(props) {
  const classes = useStyles();
  const token = localStorage.getItem("token");
  const [datos, setDatos] = useState([]);
  const [id, setId] = useState([]);
  const [update, setUpdate] = useState(false);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const idcurso = props.match.params.curso;
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  const obtenerCursoBD = useCallback(async () => {
    setLoading(true);
    await clienteAxios
      .get(`/course/${idcurso}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setDatos(res.data?.taller);
        setId(res.data._id);
        if (res.data?.taller?.urlImageTaller) {
          setPreview(res.data.taller.urlImageTaller);
        }
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
  }, [idcurso, token, setDatos, setPreview]);

  const onDrop = useCallback(
    (files) => {
      setPreview(URL.createObjectURL(files[0]));
      setDatos({
        ...datos,
        urlImageTaller: files[0],
      });
    },
    [datos, setDatos, setPreview]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const subirImagen = async () => {
    if (!datos.urlImageTaller || !preview) {
      setSnackbar({
        open: true,
        mensaje: "Seleccione una imagen antes de Cargar",
        status: "error",
      });
      return;
    } else if (
      preview &&
      preview.includes("https://cursos-uniline.s3.us-west-1.amazonaws.com")
    ) {
      return;
    }
    const formData = new FormData();
    formData.append("imagen", datos.urlImageTaller);
    setLoading(true);
    await clienteAxios
      .put(`/taller/imagenTaller/${id}`, formData, {
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

  useEffect(() => {
    obtenerCursoBD();
  }, [obtenerCursoBD, update]);

  return (
    <Fragment>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Grid container direction="row" spacing={2}>
        <Grid item md={5} sm={12}>
          <Box
            className={classes.dropZone}
            {...getRootProps()}
            height={250}
            display="flex"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
          >
            <input {...getInputProps()} />
            {datos?.urlImageTaller || preview ? (
              <Box
                height={300}
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
              <Typography>Suelta tu imagen aquí...</Typography>
            ) : (
              <Typography>
                Arrastra y suelta tu imagen aquí, o selecciona una imagen
                haciendo click aquí
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item md={7}>
          <Box>
            <Alert severity="info">
              <Typography variant="body1">
                Carga la imagen promocional de tu taller aquí. Para ser
                aceptada, debe cumplir nuestros estándares de calidad para las
                imágenes de los talleres. Directrices importantes: 600 x 600
                píxeles; formato .jpg, .jpeg, .gif, o .png.; y sin texto en la
                imagen.
              </Typography>
            </Alert>
          </Box>
          <Box my={2}>{loading ? <LinearProgress /> : null}</Box>
          <Button
            color="primary"
            variant="contained"
            size="medium"
			startIcon={<CloudUploadIcon />}
            onClick={() => subirImagen()}
          >
            Subir imagen
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
}
export default withRouter(SubirImagenTaller);