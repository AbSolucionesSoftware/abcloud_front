import React, { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  Grid,
  Hidden,
  Card,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import clienteAxios from "../../../../config/axios";
import MessageSnackbar from "../../../../components/Snackbar/snackbar";
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

export default function Answers({
  answers,
  reload,
  setReload,
  setLoading,
  question,
}) {
  const token = localStorage.getItem("token");
  const classes = useStyles();

  const [action, setAction] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });
  const [dataAnswer, setDataAnswer] = useState({});
  const [openNewTheme, setOpenNewTheme] = useState(false);

  const [dataDelete, setDataDelete] = useState();
  const [openDialogDelete, setOpenDialogDelete] = useState(false);

  const handleClickAddEditAnswer = (action = "post", answer) => {
    if (action === "edit") {
      setAction(true);
      setDataAnswer({
        ...dataAnswer,
        _id: answer._id,
        answer: answer.answer,
      });
      setOpenNewTheme(!openNewTheme);
      return;
    }
    setAction(false);
    setOpenNewTheme(!openNewTheme);
  };

  const handleClickOpenAnswer = () => {
    setOpenNewTheme(!openNewTheme);
  };

  const handleChangeAnswer = (e) => {
    setDataAnswer({
      ...dataAnswer,
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

  const handleClickAnswer = async () => {
    try {
      if (!dataAnswer.answer) return;
      setLoading(true);
      handleClickOpenAnswer();
      let data;
      if (action) {
        data = await clienteAxios.put(
          `/question/${question._id}/answer/${dataAnswer._id}`,
          dataAnswer,
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        );
      } else {
        data = await clienteAxios.post(
          `/question/${question._id}/answer/111`,
          dataAnswer,
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        );
      }
      messages("success", data.data.message);
      setReload(!reload);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      messages("error", error);
    }
  };

  const handleClickDeleteAnswer = async (idAnswer) => {
    try {
      setLoading(false);
      const data = await clienteAxios.delete(
        `/question/111/answer/${idAnswer}`,
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );
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

  return (
    <Fragment>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Grid container>
        <Grid item>
          <Box className={classes.margin}>
            <Button
              startIcon={<AddIcon style={{ fontSize: 30 }} />}
              variant="text"
              color="primary"
              className="addButton"
              onClick={() => {
                handleClickAddEditAnswer();
              }}
            >
              Nueva respuesta
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box pb={1}>
            {answers &&
              answers.map((answer, index) => {
                return (
                  <AnswerRow
                    key={index}
                    index={index}
                    answer={answer}
                    handleClickAddEditAnswer={handleClickAddEditAnswer}
                    handleChangeDialogOpenClose={handleChangeDialogOpenClose}
                    setDataDelete={setDataDelete}
                  />
                );
              })}
          </Box>
        </Grid>
      </Grid>

      <Dialog
        open={openNewTheme}
        onClose={handleClickOpenAnswer}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">Nueva respuesta</DialogTitle>
        <DialogContent>
          <DialogContentText>¿ Cual es tu nueva respuesta ?</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="answer"
            label="Answer"
            defaultValue={action === true ? dataAnswer.answer : ""}
            fullWidth
            onChange={handleChangeAnswer}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickOpenAnswer} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => handleClickAnswer()}
            color="primary"
            variant="contained"
          >
            {action ? "Editar" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmDialog
        title={"respuesta"}
        dataDelete={dataDelete}
        openDialogDelete={openDialogDelete}
        handleChangeDialogDelete={handleChangeDialogOpenClose}
        handleClickFunctionAction={handleClickDeleteAnswer}
      />
    </Fragment>
  );
}

function AnswerRow({
  answer,
  index,
  handleClickAddEditAnswer,
  handleChangeDialogOpenClose,
  setDataDelete,
}) {
  const handleClickDeleteQuestion = () => {
    setDataDelete(answer);
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
                      onClick={() => handleClickAddEditAnswer("edit", answer)}
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleClickDeleteQuestion(answer)}
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Hidden>
              <Grid item xs={10} sm={8}>
                <Typography variant="h5">{`Respuesta ${index + 1}: ${
                  answer.answer
                }`}</Typography>
              </Grid>
              <Grid item xs={2} sm={4}>
                <Hidden mdDown>
                  <Box display="flex" justifyContent="flex-end">
                    <IconButton
                      onClick={() => handleClickAddEditAnswer("edit", answer)}
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleClickDeleteQuestion(answer)}
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Box>
                </Hidden>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Box>
    </Fragment>
  );
}
