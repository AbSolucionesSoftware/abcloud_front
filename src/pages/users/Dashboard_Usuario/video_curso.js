import { Button, makeStyles } from "@material-ui/core";
import React, { useContext, useState } from "react";
import Vimeo from "@u-wave/react-vimeo";
import clienteAxios from "../../../config/axios";

import { Box, Typography, CircularProgress } from "@material-ui/core";
import { DashboardContext } from "../../../context/dashboar_context";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  itemIcon: {
    display: "flex",
    justifyContent: "center",
  },
  video: {
    backgroundColor: "#1A1A1A",
    height: "60vh",
    [theme.breakpoints.down("sm")]: {
      height: "40vh",
    },
  },
  vimeoPlayer: {
    height: "100%",
    width: "100%",
    "& iframe": {
      height: "100%",
      width: "100%",
    },
  },
}));

export default function VideoCurso({ props, user }) {
  const classes = useStyles();
  const token = localStorage.getItem("token");
  // calificado
  const {
    curso,
    temaActual,
    topics,
    update,
    setUpdate,
    setProgreso,
    setAction,
  } = useContext(DashboardContext);
  const [cursoFinalizado, setCursoFinalizado] = useState(false);

  const checkTema = async (topic) => {
    setAction(0);
    await clienteAxios
      .post(
        `/course/complete/topic/`,
        {
          idCourse: curso.course._id,
          idTopic: topic,
          idUser: user._id,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        /* if (
          user.rol === "Estudiante" &&
          parseFloat(res.data.message) >= 100 &&
          (!curso.inscriptionStudent.questionUniline ||
            curso.inscriptionStudent.questionUniline === false)
        ) {
          props.history.push(
            `/question-curse-uniline/${curso.course._id}/curso/${curso.course.slug}`
          );
        } */
        setUpdate(!update);
        setProgreso(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkVideo = () => {
    topics.forEach((topic, index) => {
      if (topics.length === index + 1 && temaActual.id === topic._id) {
        setCursoFinalizado(true);
      }
    });
    checkTema(temaActual.id);
  };

  return (
    <div>
      <Box
        id="dashboard-reproductor"
        className={classes.video}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {cursoFinalizado ? (
          <Box textAlign="center">
            <Typography variant="h4" style={{ color: "#FFFF" }}>
              ¡En hora buena!
            </Typography>
            <Typography variant="h4" style={{ color: "#FFFF" }}>
              Haz finalizado este curso
            </Typography>
            {!curso.inscriptionStudent.questionUniline ||
            curso.inscriptionStudent.questionUniline === false ? (
              <Box mt={5}>
                <Typography style={{ color: "white" }}>
                  Estamos trabajando para ofrecerte mejor contenido de calidad.
                </Typography>
                <Typography style={{ color: "white" }}>
                  Ayúdanos a responder está pequeña encuesta, tomate el tiempo
                  necesario para contestarla.
                </Typography>
                <Box my={1} />
                <Button
                  component={Link}
                  to={`/question-curse-uniline/${curso.course._id}/curso/${curso.course.slug}`}
                  variant="contained"
                  //style={{ color: "white", borderColor: "white" }}
                  color="primary"
                  disableElevation
                >
                  Realizar encuesta
                </Button>
              </Box>
            ) : null}
          </Box>
        ) : !curso.endTopicView || temaActual.video === undefined ? (
          <Typography variant="h4" style={{ color: "#FFFF" }}>
            No hay video
          </Typography>
        ) : temaActual.video === "" ? (
          <CircularProgress style={{ color: "#FFFF" }} />
        ) : (
          <Vimeo
            video={temaActual.video ? temaActual.video : ""}
            autoplay={true}
            speed={true}
            onEnd={() => checkVideo()}
            id="vimeo-player"
            className={classes.vimeoPlayer}
          />
        )}
      </Box>
    </div>
  );
}
