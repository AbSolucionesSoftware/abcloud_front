import React, { useContext } from "react";
import {
  Box,
  makeStyles,
  Grid,
  Typography,
  Button,
  CardMedia,
} from "@material-ui/core";
import LinkMaterial from "@material-ui/core/Link";
import Avatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { formatoMexico } from "../../../config/reuserFunction";
import { NavContext } from "../../../context/context_nav";
import clienteAxios from "../../../config/axios";
import { withRouter } from "react-router-dom";
import { CtxPrincipal } from "../../../context/ContextPrincipal";

const useStyles = makeStyles((theme) => ({
  imagen: {
    maxHeight: "100%",
    maxWidth: "100%",
  },
  buttons: {
    display: "block",
  },
  avatarGroup: {
    display: "flex",
    justifyContent: "center",
  },
  avatarCourse: {
    height: 100,
    width: 100,
  },
  container: {
    height: 100,
  },
  avatarContainer: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

function ListaCarrito(props) {
  const { articulo } = props;
  const curso = articulo.course;
  const paquete = articulo.package;

  if (!curso && !paquete) return null;

  if (curso) {
    return <CardCursoComponent props={props} curso={curso} />;
  } else {
    return <CardPaqueteComponent props={props} paquete={paquete} />;
  }
}

const CardCursoComponent = ({ props, curso }) => {
  const classes = useStyles();
  const { setLoading, setSnackbar, user } = props;
  let token = localStorage.getItem("token");
  const { update, setUpdate } = useContext(NavContext);
  const { setPayment } = React.useContext(CtxPrincipal);

  const eliminarCursoCarrito = async (idcurso) => {
    setLoading(true);
    await clienteAxios
      .delete(`/cart/${user._id}/delete/${idcurso}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setUpdate(!update);
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
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

  const pagarCurso = (curso) => {
    let cursos = [];

    if (curso.priceCourse.promotionPrice) {
      cursos.push({
        priceCourse: curso.priceCourse.price,
        pricePromotionCourse: curso.priceCourse.promotionPrice,
        persentagePromotion: curso.priceCourse.persentagePromotion,
        idCourse: curso._id,
        course: curso,
        promotion: true,
      });
    } else {
      cursos.push({
        priceCourse: curso.priceCourse.price,
        pricePromotionCourse: 0,
        persentagePromotion: "",
        idCourse: curso._id,
        course: curso,
        promotion: false,
      });
    }

    setPayment({
      user,
      courses: cursos,
    });
    /* localStorage.setItem("payment",
      JSON.stringify({
        user: user,
        courses: cursos,
      })
    ); */
    /* setTimeout(() => {
			props.history.push(`/compra/${curso.slug}`);
		}, 500); */
    setTimeout(() => {
      props.history.push(`/compra`);
    }, 500);
  };

  return (
    <Box my={3}>
      <Grid container spacing={2}>
        <Grid item lg={3} sm={3} xs={12}>
          <Box className={classes.container}>
            <CardMedia
              style={{ height: "100%" }}
              image={curso.urlPromotionalImage}
            />
          </Box>
        </Grid>
        <Grid item lg={6} sm={6} xs={12}>
          <Box>
            <LinkMaterial
              href={`/curso/${curso.slug}`}
              target="_blank"
              rel="noopener"
              color="inherit"
              underline="none"
            >
              <Typography variant="h5">{curso.title}</Typography>
            </LinkMaterial>
            <Typography variant="subtitle1" color="textSecondary">
              {`Por ${curso.idProfessor.name}`}
              {curso.idProfessor.profession
                ? `, ${curso.idProfessor.profession}`
                : ""}
            </Typography>
          </Box>
        </Grid>
        <Grid item lg={3} sm={3} xs={12}>
          <Box height="100%">
            <Box display="flex" justifyContent="flex-end">
              {curso.priceCourse.free ? (
                <Typography variant="h6" color="textPrimary">
                  ¡Gratis!
                </Typography>
              ) : curso.priceCourse.promotionPrice ? (
                <Box>
                  <Typography variant="h6" align="right" color="textPrimary">
                    {formatoMexico(curso.priceCourse.promotionPrice)} MXN$
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    align="right"
                    color="textSecondary"
                  >
                    <s>{formatoMexico(curso.priceCourse.price)} MXN$</s>
                  </Typography>
                </Box>
              ) : (
                <Typography variant="h6" color="textPrimary" align="right">
                  {formatoMexico(curso.priceCourse.price)} MXN$
                </Typography>
              )}
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <div>
                <Button
                  color="primary"
                  className={classes.buttons}
                  size="small"
                  onClick={() => pagarCurso(curso)}
                >
                  Comprar
                </Button>
                <Button
                  color="primary"
                  className={classes.buttons}
                  size="small"
                  onClick={() => eliminarCursoCarrito(curso._id)}
                >
                  Eliminar
                </Button>
              </div>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const CardPaqueteComponent = ({ props, paquete }) => {
  const classes = useStyles();
  const { setLoading, setSnackbar, user } = props;
  let token = localStorage.getItem("token");
  const { update, setUpdate } = useContext(NavContext);
  const { setPayment } = React.useContext(CtxPrincipal);

  const eliminarCursoCarrito = async (idPackage) => {
    setLoading(true);
    await clienteAxios
      .delete(`/cart/${user._id}/delete/pack/${idPackage}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setUpdate(!update);
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
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

  const pagarCurso = (pack) => {
    let cursos = [];
    pack.courses.forEach((curso) => {
      if (curso.prices.persentagePromotion !== "0") {
        cursos.push({
          priceCourse: curso.course.priceCourse.price,
          pricePromotionCourse: curso.prices.promotionPrice,
          persentagePromotion: curso.prices.persentagePromotion,
          idCourse: curso.courseId,
          course: curso.course,
          promotion: true,
          pack: true,
        });
      } else {
        cursos.push({
          priceCourse: curso.prices.price,
          pricePromotionCourse: 0,
          persentagePromotion: "",
          idCourse: curso.courseId,
          course: curso.course,
          promotion: false,
          pack: true,
        });
      }
    });

    setPayment({
      user,
      courses: cursos,
    });
    /* localStorage.setItem("payment",
      JSON.stringify({
        user: user,
        courses: cursos,
      })
    ); */
    setTimeout(() => {
      props.history.push(`/compra`);
    }, 500);
  };

  return (
    <Box my={3}>
      <Grid container spacing={2}>
        <Grid item lg={3} sm={3} xs={12}>
          <Box className={classes.container}>
            {paquete.image ? (
              <CardMedia style={{ height: "100%" }} image={paquete.image} />
            ) : (
              <Box className={classes.avatarContainer}>
                <AvatarGroup max={4} className={classes.avatarGroup}>
                  {paquete.courses.map((res, index) => (
                    <Avatar
                      key={index}
                      className={classes.avatarCourse}
                      alt={` curso ${index}`}
                      src={res.course?.urlPromotionalImage}
                    />
                  ))}
                </AvatarGroup>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item lg={6} sm={6} xs={12}>
          <Box>
            <Typography variant="h5">{paquete.title}</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {`Por ${paquete.idProfessor.name}`}
              {paquete.idProfessor.profession
                ? `, ${paquete.idProfessor.profession}`
                : ""}
            </Typography>
          </Box>
        </Grid>
        <Grid item lg={3} sm={3} xs={12}>
          <Box height="100%">
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="h6" align="right" color="textPrimary">
                ${formatoMexico(paquete.pricePack)} MXN
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <div>
                <Button
                  color="primary"
                  className={classes.buttons}
                  size="small"
                  onClick={() => pagarCurso(paquete)}
                >
                  Comprar
                </Button>
                <Button
                  color="primary"
                  className={classes.buttons}
                  size="small"
                  onClick={() => eliminarCursoCarrito(paquete._id)}
                >
                  Eliminar
                </Button>
              </div>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default withRouter(ListaCarrito);
