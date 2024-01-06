import React, { useState, useEffect, Fragment } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  Grid,
  Hidden,
  Card,
  CardContent,
  Collapse,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import MessageSnackbar from "../../../../components/Snackbar/snackbar";
import clienteAxios from "../../../../config/axios";
import { makeStyles } from "@material-ui/core/styles";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Spin from "../../../../components/Spin/spin";
import Answers from "./Answers";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

const useStyles = makeStyles((theme) => ({
  margin: {
    marginRight: theme.spacing(5),
    marginLeft: theme.spacing(5),
    [theme.breakpoints.down("xs")]: {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

export default function Preguntas({ open, setOpen }) {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });
  const [dataQuestion, setDataQuestion] = useState({});
  const [questionsData, setQuestionsData] = useState([]);
  const [reload, setReload] = useState(false);
  const [dataDelete, setDataDelete] = useState();
  const [openDialogDelete, setOpenDialogDelete] = useState(false);

  const handleClickOpen = (action, question) => {
    if (action === "edit") {
      setAction(true);
      setDataQuestion({
        ...dataQuestion,
        _id: question._id,
        question: question.question,
      });
      setOpen(!open);
      return;
    }
    setAction(false);
    setOpen(!open);
  };

  const handleChangeQuestion = (e) => {
    setDataQuestion({
      ...dataQuestion,
      [e.target.name]: e.target.value,
    });
    return;
  };

  const messages = (estado, mensaje) => {
    if (estado === "success") {
      setSnackbar({
        open: true,
        mensaje: mensaje,
        status: "success",
      });
    } else {
      if (mensaje.response) {
        setSnackbar({
          open: true,
          mensaje: mensaje.response.data.message,
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

  const handleClickSaveQuestion = async () => {
    try {
      if (!dataQuestion.question) return;
      setLoading(true);
      setOpen(!open);
      let data;
      if (action) {
        data = await clienteAxios.put(
          `/question/${dataQuestion._id}`,
          dataQuestion,
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        );
      } else {
        data = await clienteAxios.post("/question", dataQuestion, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
      }
      messages("success", data.data.message);
      setReload(!reload);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      messages("error", error);
    }
  };

  const handleClickDeleteQuestion = async (idQuestion) => {
    try {
      setLoading(false);
      const data = await clienteAxios.delete(`/question/${idQuestion}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });

      setLoading(false);
      messages("success", data.data.message);
      setReload(!reload);
    } catch (error) {
      setLoading(false);
      messages("error", error);
    }
  };

  const handleChangeDialogOpenClose = () =>
    setOpenDialogDelete(!openDialogDelete);

  useEffect(() => {
    const getQuestionsBase = async () => {
      try {
        setLoading(true);
        const data = await clienteAxios.get("/question");
        setQuestionsData(data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        messages("error", error);
      }
    };
    getQuestionsBase();
  }, [reload]);

  return (
    <Box>
      <Spin loading={loading} />
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />

      {questionsData &&
        questionsData.map((question, index) => {
          return (
            <AccordionQuestion
              key={index}
              index={index}
              question={question}
              handleClickOpen={handleClickOpen}
              answers={question.answers}
              reload={reload}
              setReload={setReload}
              loading={loading}
              setLoading={setLoading}
              setDataDelete={setDataDelete}
              handleChangeDialogOpenClose={handleChangeDialogOpenClose}
            />
          );
        })}

      <Dialog
        open={open}
        onClose={handleClickOpen}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">Nueva pregunta</DialogTitle>
        <DialogContent>
          <DialogContentText>¿ Cual es tu nueva pregunta ?</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="question"
            label="Pregunta"
            defaultValue={action === true ? dataQuestion.question : ""}
            fullWidth
            onChange={handleChangeQuestion}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickOpen} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => handleClickSaveQuestion()}
            color="primary"
            variant="contained"
          >
            {action ? "Editar" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
      <DeleteConfirmDialog
        title={"pregunta"}
        dataDelete={dataDelete}
        openDialogDelete={openDialogDelete}
        handleChangeDialogDelete={handleChangeDialogOpenClose}
        handleClickFunctionAction={handleClickDeleteQuestion}
      />
    </Box>
  );
}

function AccordionQuestion({
  index,
  question,
  handleClickOpen,
  answers,
  reload,
  setReload,
  loading,
  setLoading,
  setDataDelete,
  handleChangeDialogOpenClose,
}) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClickDeleteQuestion = () => {
    setDataDelete(question.question);
    handleChangeDialogOpenClose();
  };

  return (
    <Fragment>
      <Box borderRadius={5} my={2}>
        <Card variant="outlined">
          <CardActions disableSpacing>
            <Grid container spacing={3}>
              <Hidden lgUp>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end">
                    <IconButton
                      onClick={() => handleClickOpen("edit", question.question)}
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleClickDeleteQuestion(question.question)
                      }
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                    <IconButton
                      className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                      })}
                      onClick={() => handleExpandClick()}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Hidden>
              <Grid item xs={10} sm={8}>
                <Typography variant="h5">{`Pregunta ${index + 1}: ${
                  question.question.question
                }`}</Typography>
              </Grid>
              <Grid item xs={2} sm={4}>
                <Hidden mdDown>
                  <Box display="flex" justifyContent="flex-end">
                    <IconButton
                      onClick={() => handleClickOpen("edit", question.question)}
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleClickDeleteQuestion(question.question)
                      }
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                    <IconButton
                      className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                      })}
                      onClick={() => handleExpandClick()}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </Box>
                </Hidden>
              </Grid>
            </Grid>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Answers
                question={question.question}
                answers={answers}
                reload={reload}
                setReload={setReload}
                loading={loading}
                setLoading={setLoading}
              />
            </CardContent>
          </Collapse>
        </Card>
      </Box>
    </Fragment>
  );
}
