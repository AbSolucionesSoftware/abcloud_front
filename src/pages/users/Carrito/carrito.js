import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  makeStyles,
  Typography,
  Button,
  Divider,
} from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import ImagenCart from "../../../images/Cart.png";
import ShopIcon from "@material-ui/icons/Shop";
import { NavContext } from "../../../context/context_nav";
import ListaCarrito from "./lista_carrito";
import SpinNormal from "../../../components/Spin/spinNormal";
import { Fragment } from "react";
import { formatoMexico } from "../../../config/reuserFunction";
import Spin from "../../../components/Spin/spin";
import MessageSnackbar from "../../../components/Snackbar/snackbar";
import clienteAxios from "../../../config/axios";
import { CtxPrincipal } from "../../../context/ContextPrincipal";

const useStyles = makeStyles((theme) => ({
  imagen: {
    maxHeight: "100%",
    maxWidth: "100%",
  },
  background: {
    minHeight: "85vh",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Carrito(props) {
  const classes = useStyles();
  let token = localStorage.getItem("token");
  const { carrito, update, setUpdate } = useContext(NavContext);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });
  let user = { _id: "" };
  const { setPayment } = React.useContext(CtxPrincipal);

  if (!token || !user) props.history.push("/");

  if (token !== null) user = JSON.parse(localStorage.getItem("student"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (carrito.length === 0) {
    return <SpinNormal />;
  }

  if (carrito.courses.length === 0 && carrito.packsCourses.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box height="80vh" mt={5}>
          <Box display="flex" justifyContent="center">
            <Box height="60vh">
              <img
                alt="error 404"
                src={ImagenCart}
                className={classes.imagen}
              />
            </Box>
          </Box>
          <Typography variant="h4" align="center">
            Tu carrito esta vacío
          </Typography>
        </Box>
      </Container>
    );
  }

  const combineCart = [...carrito.courses, ...carrito.packsCourses];

  const render_lista = combineCart.map((articulo, index) => {
    return (
      <Fragment key={index}>
        <ListaCarrito
          articulo={articulo}
          setLoading={setLoading}
          setSnackbar={setSnackbar}
          user={user}
        />
        {combineCart.length !== index + 1 ? <Divider /> : null}
      </Fragment>
    );
  });

  /* total de carrito */
  let total = 0;
  let totalAnterior = 0;
  let descuento = 0;
  let promocion = false;
  let cursos = [];
  carrito.courses.forEach((articulo) => {
    if (articulo.course.priceCourse.free) {
      total += 0;
    } else {
      if (articulo.course.priceCourse.promotionPrice) {
        total += articulo.course.priceCourse.promotionPrice;
        promocion = true;
        cursos.push({
          priceCourse: articulo.course.priceCourse.price,
          pricePromotionCourse: articulo.course.priceCourse.promotionPrice,
          persentagePromotion: articulo.course.priceCourse.persentagePromotion,
          idCourse: articulo.course._id,
          course: articulo.course,
          promotion: true,
        });
      } else {
        total += articulo.course.priceCourse.price;
        cursos.push({
          priceCourse: articulo.course.priceCourse.price,
          pricePromotionCourse: 0,
          persentagePromotion: "",
          idCourse: articulo.course._id,
          course: articulo.course,
          promotion: false,
        });
      }
    }
    totalAnterior += articulo.course.priceCourse.price;
    descuento = Math.trunc((((total * 100) / totalAnterior - 100) * -1));
  });
  carrito.packsCourses.forEach((pack) => {
    pack.package.courses.forEach((curso) => {
      if (curso.prices.free) {
        total += 0;
      } else {
        if (curso.prices.promotionPrice !== "0") {
          total += curso.prices.promotionPrice;
          promocion = true;
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
          total += curso.prices.price;
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
      }
      totalAnterior += curso.course.priceCourse.price;
      descuento = Math.trunc((((total * 100) / totalAnterior - 100) * -1));
    });
  });

  const eliminarCarrito = async () => {
    setLoading(true);
    await clienteAxios
      .delete(`/cart/${user._id}/`, {
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

  const pagarCurso = () => {
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
			props.history.push(`/compra/${carrito._id}`);
		}, 500); */
    setTimeout(() => {
      props.history.push(`/compra`);
    }, 500);
  };

  return (
    <Container maxWidth="lg">
      <Spin loading={loading} />
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Box
        px={5}
        py={2}
        className={classes.background}
      >
        <Box mb={2}>
          <Typography variant="h4" align="center">
            Tu carrito de compras
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item lg={8} md={8} xs={12}>
            {render_lista}
          </Grid>
          <Grid item lg={4} md={4} xs={12}>
            <Box p={4}>
              <Typography variant="h5">Total:</Typography>
              <Typography variant="h4">
                <b>{formatoMexico(total)} $MXN</b>
              </Typography>
              {promocion ? (
                <Grid container spacing={3}>
                  <Grid item>
                    <Typography variant="h6" color="textSecondary">
                      <s>{formatoMexico(totalAnterior)} $MXN</s>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" color="textSecondary">
                      {descuento}% de descuento
                    </Typography>
                  </Grid>
                </Grid>
              ) : null}
              <Box my={2}>
                <Divider />
              </Box>
              <Button
                fullWidth
                color="primary"
                size="large"
                variant="contained"
                onClick={() => pagarCurso()}
                startIcon={<ShopIcon />}
              >
                Pagar ahora
              </Button>
              <Box my={1} />
              <Button
                fullWidth
                size="large"
                color="primary"
                variant="outlined"
                onClick={() => eliminarCarrito()}
                startIcon={<RemoveShoppingCartIcon />}
              >
                Vaciar carrito
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
