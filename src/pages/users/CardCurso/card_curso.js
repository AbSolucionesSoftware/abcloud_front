import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActions,
  CardMedia,
  CardContent,
  Chip,
  Grid,
  Button,
} from "@material-ui/core";
import { Box, Typography, Dialog } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { red } from "@material-ui/core/colors";
/* import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined'; */
import { formatoMexico } from "../../../config/reuserFunction";
import { withRouter } from "react-router-dom";
import WarningIcon from "@material-ui/icons/Warning";
/* import AccessTimeIcon from "@material-ui/icons/AccessTime";
import SchoolIcon from "@material-ui/icons/School";
import LanguageIcon from "@material-ui/icons/Language";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined"; */
import MessageSnackbar from "../../../components/Snackbar/snackbar";
import { NavContext } from "../../../context/context_nav";
/* import { AdquirirCursoGratis, AgregarCarritoBD } from '../PeticionesCompras/peticiones_compras'; */
import RegistroAlterno from "../RegistroAlterno/registro_alterno";
/* import ArrowForwardIcon from '@material-ui/icons/ArrowForward'; */
import { Fragment } from "react";
/* import clienteAxios from '../../../config/axios'; */
import DOMPurify from "dompurify";
import { Person, ShoppingCart, ThumbUpAlt } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    //cursor: "pointer",
    width: "100%",
    height: "100%",
    position: "relative",
  },
  media: {
    height: 170,
  },
  avatar: {
    backgroundColor: red[500],
  },
  free: {
    backgroundColor: theme.palette.error.light,
    color: "white",
  },
  title: {
    display: "-webkit-box",
    overflow: "hidden",
    position: "relative",
    textOverflow: "ellipsis",
    "-webkit-line-clamp": 3,
    "-webkit-box-orient": "vertical",
    fontSize: 18,
    fontWeight: 400,
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
    },
  },
  descripcion: {
    display: "-webkit-box",
    height: 60,
    overflow: "hidden",
    position: "relative",
    textOverflow: "ellipsis",
    "-webkit-line-clamp": 3,
    "-webkit-box-orient": "vertical",
    fontSize: 14,
    "& > p": {
      margin: 0,
    },
  },
  masInfo: {
    color: "#6F6F6F",
    minHeight: theme.spacing(17),
  },
  rating: {
    display: "flex",
    justifyContent: "flex-start",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "flex-end",
    },
  },
  oferta: {
    position: "absolute",
    backgroundColor: theme.palette.error.light,
    color: "white",
    top: 5,
    left: 5,
    padding: "0 8px",
    borderRadius: "5px",
    fontWeight: 500
  },
}));

function CardsCursos(props) {
  const classes = useStyles();
  const { curso, cursoData } = props;
  /* let token = localStorage.getItem('token'); */
  /* const [ loading, setLoading ] = useState(false); */
  const [open, setOpen] = useState(false);
  /* const [ course, setCourse ] = useState(false); */
  const { error, setError /* update, setUpdate, carrito */ } = useContext(
    NavContext
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });
  /* const urlActual = props.match.url; */
  /* let user = { _id: '' }; */

  /* if (token !== null) user = JSON.parse(localStorage.getItem('student')); */

  const handleModal = () => setOpen(!open);

  /* const obtenerMisCursos = useCallback(
		async () => {
			await clienteAxios
				.get(`/course/user/${user._id}`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					res.data.forEach((res) => {
						if (res.idCourse._id === curso._id) {
							setCourse(true);
						}
						return;
					});
				})
				.catch((err) => {
					console.log(err);
				});
		},
		[ curso._id, token, user._id ]
	); */

  /* useEffect(
		() => {
			obtenerMisCursos();
		},
		[ obtenerMisCursos ]
	); */

  /* const agregarCarrito = async (curso) => {
		if (!token || !user._id) {
			handleModal();
			localStorage.setItem('cart', JSON.stringify({ curso, urlActual }));
			return;
		}

		const result = await AgregarCarritoBD(token, user, curso);
		setLoading(true);
		if (result.status && result.status === 200) {
			setLoading(false);
			setUpdate(!update);
			setSnackbar({
				open: true,
				mensaje: result.data.message,
				status: 'success'
			});
		} else {
			setLoading(false);
			if (result.response) {
				setSnackbar({
					open: true,
					mensaje: result.response.data.message,
					status: 'error'
				});
			} else {
				setSnackbar({
					open: true,
					mensaje: 'Al parecer no se a podido conectar al servidor.',
					status: 'error'
				});
			}
		}
	}; */

  /* const adquirirCursoGratis = async (curso) => {
		if (!token || !user._id) {
			handleModal();
			localStorage.setItem('free', JSON.stringify({ curso: curso, urlActual }));
			return;
		}

		const result = await AdquirirCursoGratis(curso, user, token);
		if (result.status && result.status === 200) {
			props.history.push('/mis_cursos');
		} else {
			if (result.response) {
				setSnackbar({
					open: true,
					mensaje: result.response.data.message,
					status: 'error'
				});
			} else {
				setSnackbar({
					open: true,
					mensaje: 'Al parecer no se a podido conectar al servidor.',
					status: 'error'
				});
			}
		}
	}; */

  /* const pagarCurso = (curso) => {
		let cursos = [];

		if (curso.priceCourse.promotionPrice) {
			cursos.push({
				priceCourse: curso.priceCourse.price,
				pricePromotionCourse: curso.priceCourse.promotionPrice,
				persentagePromotion: curso.priceCourse.persentagePromotion,
				idCourse: curso._id,
				course: curso,
				promotion: true
			});
		} else {
			cursos.push({
				priceCourse: curso.priceCourse.price,
				pricePromotionCourse: 0,
				persentagePromotion: '',
				idCourse: curso._id,
				course: curso,
				promotion: false
			});
		}

		if (!token || !user._id) {
			handleModal();
			localStorage.setItem('buy', JSON.stringify({ curso: cursos, urlActual }));
			return;
		}

		localStorage.setItem(
			'payment',
			JSON.stringify({
				user: user,
				courses: cursos
			})
		);
		setTimeout(() => {
			props.history.push(`/compra`);
		}, 500);
	}; */

  /* verificar si esta en carrito */
  /* let cart = false; */
  /* if (carrito && carrito.courses) {
		carrito.courses.forEach((res) => {
			if (res.course._id === curso._id) cart = true;
		});
	} */
  /* verificar si ya tiene el curso */
  /* let course = false;
  
	if (misCursos) {
		misCursos.forEach((res) => {
			if (res.idCourse._id === curso._id) {
				course = true;
			}
			return;
		});
	} */

  return (
    <Fragment>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Card
        className={classes.root}
        //onClick={() => props.history.push(`/curso/${curso.slug}`)}
      >
        {curso.priceCourse.promotionPrice  ? (
          <Box className={classes.oferta}>
          {formatoMexico(curso.priceCourse.persentagePromotion)}% de descuento!
        </Box>
        ) : null}
        
        <CardMedia
          className={classes.media}
          image={curso.urlPromotionalImage}
        />
        <CardContent>
          <Typography color="textPrimary" className={classes.title}>
            {curso.title}
          </Typography>
          <Typography color="textSecondary" variant="caption">
            Un curso de {curso.idProfessor.name}
          </Typography>
          <Typography
            color="textSecondary"
            className={classes.descripcion}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                curso.description ? curso.description : ""
              ),
            }}
          />
          <Box mt={1}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Box className={classes.rating}>
                  <Rating
                    name="read-only"
                    value={curso.qualification}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid item style={{ display: "flex" }}>
                <Person color="disabled" />
                <Box mx={0.3} />
                <Typography color="textSecondary">
                  {cursoData ? cursoData.numInscription : 0}
                </Typography>
              </Grid>
              <Grid item style={{ display: "flex" }}>
                <ThumbUpAlt color="disabled" />
                <Box mx={0.3} />
                <Typography color="textSecondary">
                  {cursoData ? cursoData.numCalification : 0}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* <Hidden xsDown>
            <Box className={classes.masInfo}>
              <Box
                display="flex"
                alignItems="center"
                style={{ marginBottom: 2 }}
              >
                <AccessTimeIcon style={{ marginRight: 5 }} />
                <Typography>{`${curso.hours} horas de curso`}</Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                style={{ marginBottom: 2 }}
              >
                <LanguageIcon style={{ marginRight: 5 }} />
                <Typography>{`Lenguaje en ${curso.language}`}</Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                style={{ marginBottom: 2 }}
              >
                <AssessmentOutlinedIcon style={{ marginRight: 5 }} />
                <Typography>{`Nivel ${curso.level}`}</Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                style={{ marginBottom: 2 }}
              >
                <SchoolIcon style={{ marginRight: 5 }} />
                <Typography>Certificado al finalizar</Typography>
              </Box>
            </Box>
          </Hidden> */}
          <Box>
            {curso.priceCourse.free ? (
              <Chip
                className={classes.free}
                label={
                  <Typography
                    style={{ fontSize: 18, fontWeight: 500 }}
                    color="inherit"
                    align="center"
                  >
                    ¡Gratis!
                  </Typography>
                }
              />
            ) : curso.priceCourse.promotionPrice ? (
              <Grid container spacing={1}>
                <Grid item>
                  <Typography
                    style={{ fontSize: 18 }}
                    color="error"
                    align="center"
                  >
                    ${formatoMexico(curso.priceCourse.promotionPrice)} MXN
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    style={{ fontSize: 18, fontWeight: 500 }}
                    color="error"
                    align="center"
                  >
                    <s>${formatoMexico(curso.priceCourse.price)} MXN</s>
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography
                style={{ fontSize: 18, fontWeight: 500 }}
                color="textPrimary"
              >
                ${formatoMexico(curso.priceCourse.price)} MXN
              </Typography>
            )}
          </Box>
        </CardContent>
        <CardActions>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<ShoppingCart />}
            onClick={() => props.history.push(`/curso/${curso.slug}`)}
          >
            más información
          </Button>
        </CardActions>
        {/* <CardActions>
					<Box width="100%">
						<Button variant="text" color="primary" fullWidth component={Link} to={`/curso/${curso.slug}`}>
							Ver descripción completa
						</Button>
						{course ? (
							<Box display="flex" justifyContent="space-around" alignItems="center" textAlign="center">
								<Button
									fullWidth
									variant="contained"
									color="primary"
									component={Link}
									to={`/dashboard/${curso.slug}`}
								>
									ver tus clases
								</Button>
							</Box>
						) : (
							<Box display="flex" flexDirection="column" justifyContent="space-around" height={90}>
								{curso.priceCourse.free ? (
									<Button
										variant="contained"
										color="primary"
										onClick={() => adquirirCursoGratis(curso)}
										fullWidth
									>
										Adquirir
									</Button>
								) : (
									<Button
										fullWidth
										variant="contained"
										color="primary"
										onClick={() => pagarCurso(curso)}
									>
										Comprar
									</Button>
									<Button
										fullWidth
										variant="contained"
										color="primary"
										component={Link}
										to={`/curso/${curso.slug}`}
									>
										Ver curso
									</Button>
								)}
								<Hidden xsDown>
									{curso.priceCourse.free ? null : loading ? (
										<CircularProgress color="secondary" size={30} />
									) : cart ? (
										<Button
											fullWidth
											color="primary"
											variant="outlined"
											onClick={() => props.history.push('/carrito')}
											startIcon={<ShoppingCartOutlinedIcon style={{ fontSize: 25 }} />}
										>
											Ir al Carrito
										</Button>
									) : (
										<Button
											fullWidth
											color="primary"
											variant="outlined"
											onClick={() => agregarCarrito(curso)}
											startIcon={<ShoppingCartOutlinedIcon style={{ fontSize: 25 }} />}
										>
											Agregar al carrito
										</Button>
									)}
								</Hidden>
								<Hidden smUp>
									{curso.priceCourse.free ? null : loading ? (
										<CircularProgress color="secondary" size={30} />
									) : cart ? (
										<Button
											fullWidth
											color="primary"
											variant="outlined"
											onClick={() => props.history.push('/carrito')}
										>
											Ir al Carrito
										</Button>
									) : (
										<Button
											fullWidth
											color="primary"
											variant="outlined"
											onClick={() => agregarCarrito(curso)}
											startIcon={<ShoppingCartOutlinedIcon style={{ fontSize: 25 }} />}
										>
											Agregar
										</Button>
									)}
								</Hidden>
							</Box>
						)}
					</Box>
				</CardActions> */}
        <ModalRegistro
          handleModal={handleModal}
          open={open}
          error={error}
          setError={setError}
        />
      </Card>
    </Fragment>
  );
}
const ModalRegistro = ({ handleModal, open, error, setError }) => {
  const handleClose = () => {
    handleModal();
    localStorage.removeItem("coupon");
    localStorage.removeItem("cart");
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

export default withRouter(CardsCursos);
