import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { CtxPrincipal } from "../../../../context/ContextPrincipal";
import { NavContext } from "../../../../context/context_nav";
import clienteAxios from "../../../../config/axios";
import DialogRegistro from "./DialogRegistro";
import Add from "@material-ui/icons/Add";

function ActionsPaquete({ props, paquete, setSnackbar }) {
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
  const handleModal = () => setOpenRegistro(!openRegistro);
  const urlActual = props.match.url;

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

  const addToCart = async () => {
    if (cart) {
      props.history.push("/carrito");
      return;
    }
    if (!token && !user) {
      handleModal();
      localStorage.setItem('pack', JSON.stringify(urlActual));
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
      localStorage.setItem('pack', JSON.stringify(urlActual));
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
    <Tooltip
      title={<Typography>Ya tienes uno o mas de estos cursos!</Typography>}
      open={course}
      arrow
    >
      <Box display="flex">
        <Button
          onClick={() => addToCart()}
          color="primary"
          variant="outlined"
          disabled={loadingCart || cart || course}
          startIcon={
            loadingCart ? (
              <CircularProgress size={20} color="inherit" />
            ) : cart ? null : (
              <Add />
            )
          }
        >
          {cart ? "Ir a carrito" : "Carrito"}
        </Button>
        <Box mx={1} />

        <Button
          onClick={() => buyNow()}
          color="primary"
          variant="contained"
          disableRipple={course}
          disabled={course}
        >
          Comprar
        </Button>
        <DialogRegistro
          handleModal={handleModal}
          open={openRegistro}
          error={error}
          setError={setError}
        />
      </Box>
    </Tooltip>
  );
}

export default ActionsPaquete;
