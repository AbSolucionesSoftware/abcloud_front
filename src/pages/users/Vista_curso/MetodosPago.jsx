import React, { useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import FacebookIcon from "@material-ui/icons/Facebook";
import WarningIcon from "@material-ui/icons/Warning";
import { formatoMexico } from "../../../config/reuserFunction";
import { withRouter } from "react-router-dom";
import RegistroAlterno from "../RegistroAlterno/registro_alterno";
import { NavContext } from "../../../context/context_nav";
import {
  AdquirirCursoGratis,
  AgregarCarritoBD,
  CanjearCupon,
} from "../PeticionesCompras/peticiones_compras";
import { FacebookShareButton, WhatsappShareButton } from "react-share";
import urlPage from "../../../config/url";
import { Link } from "react-router-dom";
import { CtxPrincipal } from "../../../context/ContextPrincipal";
import { Done, ShoppingCart, ShopTwo, YouTube } from "@material-ui/icons";

function MetodosPago({ match, history, curso, setSnackbar }) {
  let token = localStorage.getItem("token");
  const [cupon, setCupon] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [open, setOpen] = useState(false);
  const { error, setError, update, setUpdate, carrito, misCursos } = useContext(
    NavContext
  );
  const { setPayment } = React.useContext(CtxPrincipal);
  let user = { _id: "" };
  const urlActual = match.url;

  if (token !== null) user = JSON.parse(localStorage.getItem("student"));

  const obtenerCupon = (e) => setCupon(e.target.value);
  const handleModal = () => setOpen(!open);

  const agregarCarrito = async () => {
    if (!token || !user._id) {
      handleModal();
      localStorage.setItem(
        "cart",
        JSON.stringify({ curso: curso.course, urlActual })
      );
      return;
    }

    const result = await AgregarCarritoBD(token, user, curso.course);
    setLoadingCart(true);
    if (result.status && result.status === 200) {
      setLoadingCart(false);
      setUpdate(!update);
    } else {
      setLoadingCart(false);
      if (result.response) {
        setSnackbar({
          open: true,
          mensaje: result.response.data.message,
          status: "error",
        });
      } else {
        setSnackbar({
          open: true,
          mensaje: "Al parecer no se a podido conectar al servidor.",
          status: "error",
        });
      }
    }
  };

  const adquirirCursoGratis = async (curso) => {
    if (!token || !user._id) {
      handleModal();
      localStorage.setItem(
        "free",
        JSON.stringify({ curso: curso.course, urlActual })
      );
      return;
    }
    setLoadingBuy(true);
    const result = await AdquirirCursoGratis(curso.course, user, token);
    if (result.status && result.status === 200) {
      setLoadingBuy(false);
      history.push("/mis_cursos");
    } else {
      setLoadingBuy(false);
      if (result.response) {
        setSnackbar({
          open: true,
          mensaje: result.response.data.message,
          status: "error",
        });
      } else {
        setSnackbar({
          open: true,
          mensaje: "Al parecer no se a podido conectar al servidor.",
          status: "error",
        });
      }
    }
  };

  const crearArrayCompra = (curso, cupon_descuento) => {
    let cursos = [];
    if (curso.priceCourse.promotionPrice && cupon_descuento) {
      cursos.push({
        priceCourse: curso.priceCourse.price,
        pricePromotionCourse: curso.coupon_discount.discount_price,
        persentagePromotion: curso.coupon_discount.percent_discount,
        idCourse: curso._id,
        course: curso,
        promotion: true,
        both_promotion: true,
        coupon_discount: curso.coupon_discount,
      });
    } else if (cupon_descuento) {
      cursos.push({
        priceCourse: curso.priceCourse.price,
        pricePromotionCourse: curso.coupon_discount.discount_price,
        persentagePromotion: curso.coupon_discount.percent_discount,
        idCourse: curso._id,
        course: curso,
        promotion: true,
        coupon_discount: curso.coupon_discount,
      });
    } else if (curso.priceCourse.promotionPrice) {
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
    return cursos;
  };

  const pagarCurso = (curso, cupon_descuento) => {
    const cursos = crearArrayCompra(curso, cupon_descuento);

    if (!token || !user._id) {
      handleModal();
      localStorage.setItem("buy", JSON.stringify({ curso: cursos, urlActual }));
      return;
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
			history.push(`/compra/${curso.slug}`);
		}, 500); */
    setTimeout(() => {
      history.push(`/compra`);
    }, 500);
  };

  const canjearCupon = async () => {
    if (!cupon) {
      return;
    }
    setLoading(true);
    if (
      curso.course.active_coupon &&
      cupon === curso.course.coupon_discount.coupon_code
    ) {
      if (!token || !user._id) {
        handleModal();
        const cursos = crearArrayCompra(curso.course, cupon);
        localStorage.setItem(
          "buy",
          JSON.stringify({ curso: cursos, urlActual })
        );
        setLoading(false);
        return;
      }
      pagarCurso(curso.course, cupon);
      setLoading(false);
    } else {
      if (!token || !user._id) {
        handleModal();
        localStorage.setItem(
          "coupon",
          JSON.stringify({ curso, cupon, urlActual })
        );
        setLoading(false);
        return;
      }
      const result = await CanjearCupon(token, user, curso, cupon);
      if (result.status && result.status === 200) {
        setLoading(false);
        setCupon("");
        history.push("/mis_cursos");
      } else {
        setLoading(false);
        if (result.response) {
          setSnackbar({
            open: true,
            mensaje: result.response.data.message,
            status: "error",
          });
        } else {
          setSnackbar({
            open: true,
            mensaje: "Al parecer no se a podido conectar al servidor.",
            status: "error",
          });
        }
      }
    }
  };

  /* verificar si esta en carrito */
  let cart = false;
  if (carrito && carrito.courses) {
    carrito.courses.forEach((res) => {
      if (res.course._id === curso.course._id) cart = true;
    });
  }
  /* verificar si ya tiene el curso */
  let course = false;

  if (misCursos) {
    misCursos.forEach((res) => {
      if (res.idCourse._id === curso.course._id) {
        course = true;
      }
      return;
    });
  }

  return (
    <>
      <Box my={1}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            {curso.course.priceCourse ? (
              curso.course.priceCourse.free ? (
                <Typography style={{ color: "white" }} variant="h4">
                  <b>¡Este curso es gratis!</b>
                </Typography>
              ) : curso.course.priceCourse.promotionPrice ? (
                <Box display="flex">
                  <Typography
                    variant="h6"
                    style={{ color: "white", marginRight: 16 }}
                  >
                    <s>${formatoMexico(curso.course.priceCourse.price)}</s>
                  </Typography>
                  <Typography
                    variant="h4"
                    style={{ color: "white", marginRight: 16 }}
                  >
                    <b>
                      ${formatoMexico(curso.course.priceCourse.promotionPrice)}{" "}
                      MXN
                    </b>
                  </Typography>
                </Box>
              ) : (
                <Typography variant="h4" style={{ color: "white" }}>
                  <b>${formatoMexico(curso.course.priceCourse.price)} MXN</b>
                </Typography>
              )
            ) : (
              <Typography variant="h4" style={{ color: "white" }}>
                <b>$0 MXN</b>
              </Typography>
            )}
          </Grid>
          {course ? ( //no lleva signo
            <Grid item xs={12} sm={4}>
              <Button
                size="large"
                startIcon={<YouTube />}
                disableElevation
                variant="contained"
                color="primary"
                component={Link}
                to={`/dashboard/${curso.course.slug}`}
                fullWidth
              >
                Ir al curso
              </Button>
            </Grid>
          ) : (
            <>
              <Grid item xs={12} sm={3}>
                {curso.course.priceCourse && curso.course.priceCourse.free ? ( //no lleva singos
                  <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    size="large"
                    startIcon={
                      loadingBuy ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <ShopTwo />
                      )
                    }
                    onClick={() => adquirirCursoGratis(curso)}
                  >
                    ¡Inscríbete!
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    variant="contained"
                    disableElevation
                    size="large"
                    disabled={!curso.course.priceCourse ? true : false}
                    onClick={() => pagarCurso(curso.course)}
                    startIcon={<ShopTwo />}
                    fullWidth
                  >
                    Comprar
                  </Button>
                )}
              </Grid>
              <Grid item xs={12} sm={3}>
                {curso.course.priceCourse &&
                curso.course.priceCourse.free ? null : cart ? ( //no lleva signos
                  <Button
                    color="primary"
                    variant="contained"
                    disableElevation
                    size="large"
                    startIcon={<Done />}
                    onClick={() => history.push("/carrito")}
                    fullWidth
                  >
                    Carrito
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    disableElevation
                    disabled={!curso.course.priceCourse ? true : false}
                    size="large"
                    startIcon={
                      loadingCart ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <ShoppingCart />
                      )
                    }
                    onClick={() => agregarCarrito()}
                  >
                    Carrito
                  </Button>
                )}
              </Grid>
              {curso.course.priceCourse && !curso.course.priceCourse.free ? (
                <Grid xs={12}>
                  <Box my={1} alignItems="center">
                    <Typography variant="h6" style={{ color: "white" }}>
                      <b>¿Tienes un cupón de descuento? ¡Aplicalo aquí!</b>
                    </Typography>
                    <Paper style={{ width: 350 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="código de cupon"
                        size="small"
                        onChange={obtenerCupon}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                color="secondary"
                                startIcon={
                                  loading ? (
                                    <CircularProgress
                                      size={20}
                                      color="inherit"
                                    />
                                  ) : null
                                }
                                onClick={() => canjearCupon()}
                                disabled={loading}
                              >
                                Canjear
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                        /* inputProps={{ style: { textTransform: "uppercase" } }} */
                      />
                    </Paper>
                  </Box>
                </Grid>
              ) : null}
            </>
          )}
        </Grid>
      </Box>
      <Box>
        <Typography style={{ color: "white" }}>
          <b>Comparte este curso con tus amigos</b>
        </Typography>
        <Grid container spacing={3}>
          <Grid item>
            <FacebookShareButton
              url={urlPage + urlActual}
              quote={curso.course.title}
            >
              <FacebookIcon style={{ fontSize: 50, color: "white" }} />
            </FacebookShareButton>
          </Grid>
          <Grid item>
            <WhatsappShareButton
              url={urlPage + urlActual}
              title={curso.course.title}
              separator=":: "
            >
              <WhatsAppIcon style={{ fontSize: 50, color: "white" }} />
            </WhatsappShareButton>
          </Grid>
        </Grid>
      </Box>
      <ModalRegistro
        handleModal={handleModal}
        open={open}
        error={error}
        setError={setError}
      />
    </>
  );
}

const ModalRegistro = ({ handleModal, open, error, setError }) => {
  const handleClose = () => {
    handleModal();
    localStorage.removeItem("coupon");
    localStorage.removeItem("cart");
    localStorage.removeItem("buy");
    localStorage.removeItem("free");
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
export default withRouter(MetodosPago);
