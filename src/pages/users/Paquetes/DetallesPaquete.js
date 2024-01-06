import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Box from "@material-ui/core/Box";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  formatoFechaCurso,
  formatoMexico,
} from "../../../config/reuserFunction";
import CardCursoPack from "./CardCursoPack";
import WarningIcon from "@material-ui/icons/Warning";
import { NavContext } from "../../../context/context_nav";
import RegistroAlterno from "../RegistroAlterno/registro_alterno";
import clienteAxios from "../../../config/axios";
import { withRouter } from "react-router-dom";
import { CtxPrincipal } from "../../../context/ContextPrincipal";

//ACTUAL MENTE ESTA VISTA YA NO ESTA VISIBLE

function DetallesPaquete(props) {
  const { paquete, handleClose, open, setSnackbar } = props;
  let token = localStorage.getItem("token");
  let user = JSON.parse(localStorage.getItem("student"));
  const [openRegistro, setOpenRegistro] = React.useState(false);
  const {
    error,
    setError,
    update,
    setUpdate,
    carrito,
    misCursos,
  } = React.useContext(NavContext);
  const [loadingCart, setLoadingCart] = React.useState(false);
  const { setPayment } = React.useContext(CtxPrincipal);

  /* verificar si esta en carrito */
  let cart = false;
  if (carrito && carrito.packsCourses && carrito.packsCourses.length) {
    carrito.packsCourses.forEach((res) => {
      if (res.package._id === paquete._id) cart = true;
    });
  }
  /* verificar si ya tiene el curso */
  let course = false;
  if (misCursos) {
    misCursos.forEach((res) => {
      paquete.courses.forEach((cours) => {
        if (res.idCourse._id === cours.courseId) {
          course = true;
        }
      });
    });
  }

  const handleModal = () => setOpenRegistro(!openRegistro);

  const addToCart = async () => {
    if (cart) {
      props.history.push("/carrito");
      return;
    }
    if (!token && !user) {
      handleModal();
      //localStorage.setItem('cart', JSON.stringify({ curso, urlActual }));
      return;
    }
    setLoadingCart(true);
    await clienteAxios
      .post(
        `/cart/pack/${user._id}`,
        {
          idPackage: paquete._id,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoadingCart(false);
        setUpdate(!update);
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
        handleClose();
      })
      .catch((err) => {
        setLoadingCart(false);
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

  const buyNow = () => {
    if (course) {
      return;
    }
    if (!token && !user) {
      handleModal();
      //localStorage.setItem('cart', JSON.stringify({ curso, urlActual }));
      return;
    }

    let cursos = [];
    paquete.courses.forEach((curso) => {
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
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby={`detalle-paquete-${paquete._id}`}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id={`detalle-paquete-${paquete._id}`}>
          <Typography style={{ fontSize: 20 }}> {paquete.title}</Typography>
          <Typography variant="body2">{`Creado por ${
            paquete.idProfessor.name
          } el ${formatoFechaCurso(paquete.createdAt)}`}</Typography>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Grid container spacing={2}>
              {paquete.courses.map((res, index) => (
                <Grid key={index} item md={4} xs={12}>
                  <CardCursoPack cursoObj={res} />
                </Grid>
              ))}
            </Grid>
          </Box>
          <Divider />
          <Box display="flex" justifyContent="flex-end">
            <Typography variant="h5">
              Por solo ${formatoMexico(paquete.pricePack)} MXN
            </Typography>
          </Box>
          <ModalRegistro
            handleModal={handleModal}
            open={openRegistro}
            error={error}
            setError={setError}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => addToCart()}
            color="primary"
            disabled={loadingCart}
            startIcon={
              loadingCart ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {cart ? "Ir a carrito" : "Carrito"}
          </Button>
          <Button
            onClick={() => buyNow()}
            color="primary"
            disableRipple={course}
          >
            {course ? "Ya tienes uno o mas de estos cursos!" : "Comprar"}
          </Button>
          <Button onClick={() => handleClose()} color="inherit">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withRouter(DetallesPaquete);

const ModalRegistro = ({ handleModal, open, error, setError }) => {
  const handleClose = () => {
    handleModal();
    //localStorage.removeItem("coupon");
    //localStorage.removeItem("cart");
    setError({ error: false, message: "" });
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      fullWidth
    >
      {!error.error ? (
        <RegistroAlterno />
      ) : error.message.response ? (
        <Box m={5} display="flex" alignItems="center">
          <WarningIcon
            style={{ fontSize: 70, marginRight: 10 }}
            color="error"
          />
          <Box>
            <Typography variant="h6">Lo sentimos</Typography>
            <Typography variant="h5">
              {error.message.response.data.message}
            </Typography>
          </Box>
        </Box>
      ) : (
        <div>hubo un error desconocido</div>
      )}
    </Dialog>
  );
};
