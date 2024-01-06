import React, { useContext, useState } from "react";
import {
  Box,
  InputAdornment,
  TextField,
  CircularProgress,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import jwt_decode from "jwt-decode";
import { NavContext } from "../../../../context/context_nav";
import clienteAxios from "../../../../config/axios";
import MessageSnackbar from "../../../../components/Snackbar/snackbar";
import { ComentariosCursoCtx } from "../../../../context/comentariosCursoCtx";
import { Send } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  respuestas: {
    margin: "3px 0px 0px 32px",
    [theme.breakpoints.down("xs")]: {
      margin: "3px 0px 0px",
    }
  },
}));

function Responder({ comentario, curso }) {
  const classes = useStyles();
  const token = localStorage.getItem("token");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });
  const { misCursos } = useContext(NavContext);
  const { setReply } = React.useContext(ComentariosCursoCtx);
  if (!token) return null;
  const usuario = jwt_decode(token);
  if (!usuario) return null;
  let course = false;
  if (misCursos) {
    misCursos.forEach((res) => {
      if (res.idCourse._id === curso.course._id) {
        course = true;
      }
    });
  }
  if (!course) return null;

  const handleChangeReply = (value) => setAnswer(value);

  const sendReply = async (e) => {
    e.preventDefault();
    setLoading(true);
    await clienteAxios
      .post(
        `/comment/answerQualification/create/${curso.course._id}/${usuario._id}/${comentario._id}`,
        { answer },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setReply((prev) => ({
          ...prev,
          data: [res.data.answer, ...prev.data],
        }));
        setLoading(false);
        setAnswer("");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setSnackbar({
            open: true,
            mensaje: err.response.data.message
              ? err.response.data.message
              : err.message,
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

  return (
    <Box className={classes.respuestas} mt={1}>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <form autoComplete="off" onSubmit={sendReply}>
        <TextField
          variant="outlined"
          placeholder={`Responder a ${comentario.idUser.name}`}
          size="small"
          fullWidth
          multiline
          rows={2}
          value={answer}
          onChange={(e) => handleChangeReply(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                  type="submit"
                  color="primary"
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Send />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>
    </Box>
  );
}

export default Responder;
