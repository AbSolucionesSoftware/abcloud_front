import React, { Fragment, useCallback, useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Rating from "@material-ui/lab/Rating";
import CloudDoneIcon from "@material-ui/icons/CloudDone";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import DeleteIcon from "@material-ui/icons/Delete";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import CloudOffIcon from "@material-ui/icons/CloudOff";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import { Link } from "react-router-dom";
import {
  formatoFechaCurso,
  formatoMexico,
} from "../../../config/reuserFunction";
import clienteAxios from "../../../config/axios";
import ImagenIcon from "../../../images/imagen-none.png";
import {
  verificarBloquesCurso,
  verificarInformacionCurso,
  verificarLearningsCurso,
  verificarPrecioCurso,
} from "../Subir_curso/verificar_contenido";
import LinkMaterial from "@material-ui/core/Link";
import { CardHeader, Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 170,
    paddingTop: "56.25%", // 16:9
  },
}));

export default function CursosProfesor({
  datos,
  update,
  setUpdate,
  setLoading,
  setSnackbar,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const curso = datos.course;
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [blocks, setBlocks] = useState([]);

  const obtenerBloquesBD = useCallback(async () => {
    if (curso._id && token) {
      await clienteAxios
        .get(`/course/data/${curso._id}`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
        .then((res) => {
          setBlocks(res.data);
        })
        .catch((err) => {
          return;
        });
    }
  }, [curso._id, token]);

  const publicarCurso = async () => {
    if (
      verificarInformacionCurso(curso) &&
      verificarLearningsCurso(curso) &&
      verificarBloquesCurso(blocks) &&
      verificarPrecioCurso(curso)
    ) {
      await clienteAxios
        .put(
          `/course/public/${curso._id}`,
          {
            publication: !curso.publication,
          },
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
    } else {
      setSnackbar({
        open: true,
        mensaje: "Tu curso aun esta incompleto.",
        status: "error",
      });
    }
  };

  const eliminarCurso = async () => {
    await clienteAxios
      .delete(`/course/${curso._id}`, {
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
    obtenerBloquesBD();
  }, [obtenerBloquesBD]);

  const toggleModal = () => {
    setOpen(!open);
  };

  return (
    <Fragment>
      <Grid item lg={3} md={4} sm={6} xs={12}>
        <Box my={2}>
          <Card>
            <CardActionArea>
              <LinkMaterial
                component={Link}
                to={`/instructor/contenido_curso/${curso._id}/general`}
                underline="none"
                color="inherit"
              >
                <CardHeader
                  style={{
                    padding: 0,
                    textAlign: "center",
                    backgroundColor: curso.publication ? "#dcedc8" : "#eeeeee",
                  }}
                  subheader={
                    curso.publication ? (
                      <Box
                        justifyContent="center"
                        display="flex"
                        alignItems="center"
                        style={{color: "#0000008A"}}
                      >
                        <CloudDoneIcon />
                        <Box mx={1} />
                        {` Publicado`}
                      </Box>
                    ) : (
                      <Box
                        justifyContent="center"
                        display="flex"
                        alignItems="center"
                        style={{color: "#0000008A"}}
                      >
                        <CloudOffIcon />
                        <Box mx={1} />
                        {` No publicado`}
                      </Box>
                    )
                  }
                />
                <CardMedia
                  className={classes.media}
                  image={
                    curso.urlPromotionalImage
                      ? curso.urlPromotionalImage
                      : ImagenIcon
                  }
                  title={`imagen curso ${curso._id}`}
                />
                <CardContent>
                  <Box style={{height: 160}}>
                  <Box>
                    {!curso.qualification ? (
                      <Typography variant="body2">
                        Sin calificaciones
                      </Typography>
                    ) : (
                      <Rating
                        size="small"
                        name="read-only"
                        value={curso.qualification}
                        readOnly
                        precision={0.5}
                      />
                    )}
                  </Box>
                  <Box className="truncate-multiline">
                    <Typography variant="h5" style={{ fontSize: "21px" }}>
                      {curso.title}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle1" color="textSecondary">
                    {formatoFechaCurso(curso.createdAt)}
                  </Typography>
                  <Box display="flex" my={2}>
                    {curso.priceCourse && curso.priceCourse.promotionPrice ? (
                      <Fragment>
                        <Box display="flex">
                          <LocalOfferOutlinedIcon color="primary" />
                          <Typography color="primary">
                            <b>{`%${curso.priceCourse.persentagePromotion}`}</b>
                          </Typography>
                        </Box>
                        <Box mx={1} />
                      </Fragment>
                    ) : null}

                    <Typography>
                      {!curso.priceCourse ? (
                        "Sin precio"
                      ) : curso.priceCourse.free ? (
                        "Gratis"
                      ) : curso.priceCourse.promotionPrice ? (
                        <Fragment>
                          <b style={{ marginRight: theme.spacing(1) }}>
                            ${formatoMexico(curso.priceCourse.promotionPrice)}
                          </b>
                          <s>${formatoMexico(curso.priceCourse.price)}</s>
                        </Fragment>
                      ) : (
                        `$${formatoMexico(curso.priceCourse.price)}`
                      )}
                    </Typography>
                  </Box>
                  </Box>
                  <Divider />
                  <Box mt={1} display="flex" justifyContent="space-around">
                    <Box textAlign="center">
                      <TrendingUpIcon
                        style={{
                          color: theme.palette.success.main,
                        }}
                      />
                      <Typography>${formatoMexico(datos.sales)}</Typography>
                    </Box>
                    <Box textAlign="center">
                      <PersonAddIcon />
                      <Typography>{datos.numInscription}</Typography>
                    </Box>
                    <Box textAlign="center">
                      <ThumbUpIcon color="primary" />
                      <Typography>{datos.numCalification}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </LinkMaterial>
            </CardActionArea>

            <CardActions disableSpacing>
              <Button
                aria-label="publicar-curso"
                fullWidth
                size="small"
                color={curso.publication ? "primary" : "default"}
                onClick={() => publicarCurso()}
                startIcon={curso.publication ? <CloudOffIcon /> : <CloudDoneIcon />}
              >
                {curso.publication ? "Ocultar" : "Publicar"}
              </Button>
              <Button
                fullWidth
                size="small"
                color="inherit"
                target="_blank"
                href={`/dashboard/${curso.slug}`}
                startIcon={<PlayCircleFilledIcon />}
              >
                Ver
              </Button>
              {!datos.blockCourse && datos.numInscription === 0 ? (
                <ModalDelete
                  open={open}
                  toggleModal={toggleModal}
                  eliminarCurso={eliminarCurso}
                />
              ) : null}
            </CardActions>
          </Card>
        </Box>
      </Grid>
    </Fragment>
  );
}

const ModalDelete = ({ open, toggleModal, eliminarCurso }) => {
  return (
    <Fragment>
      <Button
        size="small"
        fullWidth
        color="secondary"
        startIcon={<DeleteIcon />}
        onClick={toggleModal}
      >
        Borrar
      </Button>
      <Dialog open={open} onClose={toggleModal}>
        <DialogTitle>{"Estás seguro de eliminar este curso?"}</DialogTitle>
        <DialogActions>
          <Button onClick={toggleModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={eliminarCurso} color="secondary" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
