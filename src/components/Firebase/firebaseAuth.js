import React, { useState, useContext, useCallback } from "react";
import clienteAxios from "../../config/axios";
import MessageSnackbar from "../Snackbar/snackbar";
import Spin from "../Spin/spin";
import jwt_decode from "jwt-decode";
import { withRouter } from "react-router-dom";
import { NavContext } from "../../context/context_nav";
import Button from "@material-ui/core/Button";
import {
  AdquirirCursoGratis,
  AgregarCarritoBD,
  CanjearCupon,
} from "../../pages/users/PeticionesCompras/peticiones_compras";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { app, obtenerTokenFCM } from "./firebaseInit";

function Firebase(props) {
  const [loading, setLoading] = useState(false);
  const { setError, carrito, misCursos } = useContext(NavContext);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);

  const obtenerMisCursos = async (user, token) => {
    return await clienteAxios
      .get(`/course/user/${user._id}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  };

  const canjearCupon = useCallback(
    async ({ curso, cupon, urlActual }) => {
      setLoading(true);
      let token = localStorage.getItem("token");
      let user = JSON.parse(localStorage.getItem("student"));

      const result = await CanjearCupon(token, user, curso, cupon);
      if (!result.status || result.status !== 200) {
        setLoading(false);
        localStorage.removeItem("coupon");
        setError({ error: true, message: result });
        props.history.push(urlActual);
        return;
      }
      setLoading(false);
      localStorage.removeItem("coupon");
      props.history.push("/mis_cursos");
    },
    [props.history, setError]
  );

  const agregarCarrito = useCallback(
    async ({ curso, urlActual }) => {
      setLoading(true);
      let token = localStorage.getItem("token");
      let user = JSON.parse(localStorage.getItem("student"));

      let course = false;
      let cart = false;

      //verificar si ya tienes el curso
      misCursos.forEach((res) => {
        if (res.idCourse._id === curso) {
          course = true;
        }
        return;
      });

      //verificar si esta en carrito
      if (carrito && carrito.courses) {
        carrito.courses.forEach((res) => {
          cart = true;
          return;
        });
      }
      if (course) {
        setLoading(false);
        localStorage.removeItem("cart");
        props.history.push(`/dashboard/${curso}`);
        return;
      }
      if (cart) {
        setLoading(false);
        localStorage.removeItem("cart");
        props.history.push("/carrito");
        return;
      }

      const result = await AgregarCarritoBD(token, user, curso);
      if (!result.status || result.status !== 200) {
        setLoading(false);
        localStorage.removeItem("cart");
        setError({ error: true, message: result });
        props.history.push(urlActual);
        return;
      }
      setLoading(false);
      localStorage.removeItem("cart");
      props.history.push("/carrito");
    },
    [props.history, setError, carrito, misCursos]
  );

  const comprarCurso = useCallback(
    async ({ curso, urlActual }) => {
      setLoading(true);
      let token = localStorage.getItem("token");
      let user = JSON.parse(localStorage.getItem("student"));
      let course = false;

      const misCursos = await obtenerMisCursos(user, token);

      //verificar si ya tienes el curso
      misCursos.forEach((res) => {
        if (res.idCourse._id === curso[0].idCourse) {
          course = true;
        }
        return;
      });
      setLoading(false);
      if (course) {
        localStorage.removeItem("buy");
        localStorage.setItem(
          "payment",
          JSON.stringify({
            user: user,
            courses: curso,
          })
        );
        setTimeout(() => {
          props.history.push(`/dashboard/${curso[0].course.slug}`);
        }, 500);
        return;
      }
      localStorage.removeItem("buy");
      localStorage.setItem(
        "payment",
        JSON.stringify({
          user: user,
          courses: curso,
        })
      );
      setTimeout(() => {
        props.history.push(`/compra`);
      }, 500);
    },
    [props.history]
  );

  const adquirirCursoGratis = useCallback(
    async ({ curso, urlActual }) => {
      setLoading(true);
      let token = localStorage.getItem("token");
      let user = JSON.parse(localStorage.getItem("student"));
      let course = false;

      const misCursos = await obtenerMisCursos(user, token);

      //verificar si ya tienes el curso
      misCursos.forEach((res) => {
        if (res.idCourse._id === curso._id) {
          course = true;
        }
        return;
      });
      if (course) {
        setLoading(false);
        localStorage.removeItem("free");
        setTimeout(() => {
          props.history.push(`/dashboard/${curso.slug}`);
        }, 500);
        return;
      }
      const result = await AdquirirCursoGratis(curso, user, token);
      if (result.status && result.status === 200) {
        setLoading(false);
        localStorage.removeItem("free");
        props.history.push("/mis_cursos");
      } else {
        localStorage.removeItem("free");
        setLoading(false);
        setError({ error: true, message: result });
        props.history.push(urlActual);
        return;
      }
    },
    [props.history, setError]
  );

  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        //const credential = GoogleAuthProvider.credentialFromResult(result);
        //const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
        setLoading(true);
        const messagingToken = await obtenerTokenFCM();
        await clienteAxios
          .post("/user/firebase", {
            email: user.email,
            name: user.displayName,
            messagingToken,
          })
          .then((res) => {
            //Usuario creado correctamente
            setLoading(false);
            const token = res.data.token;
            const decoded = jwt_decode(token);
            localStorage.setItem("token", token);
            localStorage.setItem("student", JSON.stringify(decoded));

            /* redireccion en caso de ser comprado un curso o aplicar cupon */
            let cuponItem = JSON.parse(localStorage.getItem("coupon"));
            let cartItem = JSON.parse(localStorage.getItem("cart"));
            let buyItem = JSON.parse(localStorage.getItem("buy"));
            let freeItem = JSON.parse(localStorage.getItem("free"));
            let packItem = JSON.parse(localStorage.getItem("pack"));

            if (cuponItem) {
              canjearCupon(cuponItem);
            } else if (cartItem) {
              agregarCarrito(cartItem);
            } else if (buyItem) {
              comprarCurso(buyItem);
            } else if (freeItem) {
              adquirirCursoGratis(freeItem);
            } else if (packItem){ 
              props.handleClose();
              props.history.push(packItem);
            }else {
              props.history.push("/");
            }
          })
          .catch((err) => {
            /* console.log(err.response); */
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
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log({ errorCode, errorMessage, email, credential });
        setSnackbar({
          open: true,
          mensaje: errorMessage,
          status: "error",
        });
      });
  };

  return (
    <div>
      <Spin loading={loading} />
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Button
        disableElevation
        color="secondary"
        variant="contained"
        size="large"
        fullWidth
        onClick={() => loginWithGoogle()}
        startIcon={<FontAwesomeIcon icon={faGoogle} />}
        style={{ textTransform: "none" }}
      >
        Inicia sesión con Google
      </Button>
    </div>
  );
}

export default withRouter(Firebase);
