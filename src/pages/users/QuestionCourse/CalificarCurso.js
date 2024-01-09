import React, { useState } from "react";
import {
  Box,
  Button,
  makeStyles,
  TextField,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import clienteAxios from "../../../config/axios";

const useStyles = makeStyles((theme) => ({
  content: {
    width: "100%",
    margin: "10px",
    display: "flex",
    justifyContent: "center",
    // alignItem
  },
  contentBox: {
    width: "80%",
  },
  contentButton: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "10px 0px",
  },
  buttonStyle: {
    //backgroundColor: "rgb(60,0,143)",
    color: "white",
    padding: "10px 25px",
    fontSize: "14px",
  },
}));

export default function CalificarCurso({ setLoading, idCurso, props, slug }) {
  const classes = useStyles();
  const token = localStorage.getItem("token");
  let user = { _id: "" };
  if (token !== null) user = JSON.parse(localStorage.getItem("student"));

  const [calificacion, setCalificacion] = useState({
    calificacion: 0,
    comentario: "",
  });

  const obtenerComentario = (comentario) =>
    setCalificacion({ ...calificacion, comentario: comentario });
  const obtenerCalificacion = (calificacion2) =>
    setCalificacion({ ...calificacion, calificacion: calificacion2 });

  const guardarCalificacionBD = async () => {
    if (!calificacion.calificacion || !calificacion.comentario) {
      return props.history.push(`/dashboard/${slug}`);
    }
    setLoading(true);
    await clienteAxios
      .post(
        `/course/comment/${user._id}/course/${idCurso}`,
        {
          comment: calificacion.comentario,
          qualification: calificacion.calificacion,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        props.history.push(`/dashboard/${slug}`)
      })
      .catch((err) => {
        props.history.push(`/dashboard/${slug}`)
      });
  };

  return (
    <div className={classes.content}>
      <div className={classes.contentBox}>
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <Rating
            name="simple-controlled"
            value={calificacion.calificacion}
            onChange={(event, newValue) => {
              obtenerCalificacion(newValue);
            }}
            precision={0.5}
            size="large"
          />
        </Box>
        <TextField
          id="outlined-calification"
          label="Opinion del curso"
          margin="dense"
          autoFocus
          multiline
          fullWidth
          rows={10}
          value={calificacion.comentario}
          onChange={(e) => obtenerComentario(e.target.value)}
          variant="outlined"
        />
        <div className={classes.contentButton}>
          <Button
            className={classes.buttonStyle}
            onClick={() => guardarCalificacionBD()}
            variant="contained"
            color="primary"
          >
            {!calificacion.comentario && !calificacion.comentario
              ? "Omitir"
              : "Calificar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
