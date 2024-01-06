import React, { useState, useEffect } from "react";
import { Box, Button, makeStyles } from "@material-ui/core";
import { styleQuestions } from "./QuestionsStyle";
import Answers from "./Answers";
import clienteAxios from "../../../config/axios";
import Spin from "../../../components/Spin/spin";
import NavQuestion from "./NavQuestion";
import ImgData from "../../../images/Consulting-rafiki.svg";
import CalificarCurso from "./CalificarCurso";

const useStyles = makeStyles((theme) => styleQuestions(theme));

export default function Questions(props) {
  const classes = useStyles();

  const idCurso = props.match.params.idCurso;
  const slug = props.match.params.slug;

  let user = { _id: "" };
  const token = localStorage.getItem("token");

  if (token !== null) user = JSON.parse(localStorage.getItem("student"));

  const [dataQuestions, setDataQuestions] = useState([]);
  const [allResponseUser, setAllResponseUser] = useState([]);

  const [actiallyQuestion, setActiallyQuestion] = useState({});
  const [answersSelected, setAnswersSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calificar, setCalificar] = useState(false);

  const getQuestions = async () => {
    try {
      setLoading(true);
      const data = await clienteAxios.get("/question");
      setDataQuestions(data.data);
      if (data.data.length > 0) {
        setActiallyQuestion({
          index: 0,
          data: data.data[0],
        });
        setLoading(false);
      } else {
        //Redirect to home - dash
      }
    } catch (error) {
      console.log(error.response)
    }
  };

  const saveAnswersUser = async () => {
    try {
      await clienteAxios.post(
        `/question/answers/course/${idCurso}/user/${user._id}`,
        [...allResponseUser, ...answersSelected],
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleClickNextAndFinish = async () => {
    if (answersSelected.length < 1) return;
    setLoading(true);
    const next = actiallyQuestion.index + 1;
    if (next > dataQuestions.length - 1) {
      await saveAnswersUser();
      setActiallyQuestion({
        ...actiallyQuestion,
        index: next,
      });
      setCalificar(true);
    } else {
      setAllResponseUser([...allResponseUser, ...answersSelected]);
      setActiallyQuestion({
        index: next,
        data: dataQuestions[next],
      });
      setAnswersSelected([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getQuestions();
  }, []);

  if (!token || !user) {
    props.history.push("/");
  }

  if (loading) {
    return <Spin loading={loading} />;
  }

  return (
    <div className={classes.fatherContent}>
      <Box className={classes.content}>
        <NavQuestion
          actiallyQuestion={actiallyQuestion}
          dataQuestions={dataQuestions}
        />
        {!calificar ? (
          <>
            <p className={classes.title}>
              Estamos trabajando para ofrecerte mejor contenido de calidad.
            </p>
            <p className={classes.subTitle}>Ayúdanos a responder está pequeña encuesta, tomate el tiempo necesario para contestarla.</p>
          </>
        ) : (
          <>
            <p
              style={{ textAlign: "center", marginBottom: "20px" }}
              className={classes.title}
            >
              ¿Te gustaría calificar el curso?
            </p>
            <p style={{ textAlign: "center" }} className={classes.subTitle}>¡Danos tu opinión para mejorar!</p>
          </>
        )}

        {calificar ? (
          <CalificarCurso
            setLoading={setLoading}
            idCurso={idCurso}
            props={props}
            slug={slug}
          />
        ) : (
          <ContentQuestions
            answersSelected={answersSelected}
            setAnswersSelected={setAnswersSelected}
            actiallyQuestion={actiallyQuestion}
            classes={classes}
            handleClickNextAndFinish={handleClickNextAndFinish}
            idCurso={idCurso}
          />
        )}
      </Box>
    </div>
  );
}

function ContentQuestions({
  classes,
  actiallyQuestion,
  answersSelected,
  setAnswersSelected,
  handleClickNextAndFinish,
  idCurso,
}) {
  if (!actiallyQuestion) return <p>a</p>;
  return (
    <div className={classes.contentQuestion}>
      <p className={classes.questionStyle}>
        {" "}
        {actiallyQuestion?.index + 1}.-{" "}
        {actiallyQuestion?.data?.question?.question}
      </p>
      <div
        style={{
          display: "flex",
        }}
      >
        <Answers
          answers={actiallyQuestion?.data?.answers}
          answersSelected={answersSelected}
          setAnswersSelected={setAnswersSelected}
          textQuestion={actiallyQuestion?.data?.question?.question}
          idCurso={idCurso}
        />
        <div>
          <img
            className={classes.imgQuestion}
            alt={"imagen preguntas"}
            src={ImgData}
          />
        </div>
      </div>

      <Box className={classes.contentButtonNext}>
        <Button
          className={classes.buttonNext}
          variant="contained"
          size="medium"
          color="primary"
          onClick={() => handleClickNextAndFinish()}
        >
          Siguiente
        </Button>
      </Box>
    </div>
  );
}
