import React, { Fragment } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { CircularProgress, IconButton, TextField } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import jwt_decode from "jwt-decode";
import clienteAxios from "../../../../config/axios";
import MessageSnackbar from "../../../../components/Snackbar/snackbar";
import { ComentariosCursoCtx } from "../../../../context/comentariosCursoCtx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditarRespuesta({ data, index }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [newReply, setNewReply] = React.useState(data.answer);
  const { reply, setReply } = React.useContext(ComentariosCursoCtx);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    mensaje: "",
    status: "",
  });
  const token = localStorage.getItem("token");

  if (!token) return null;
  const usuario = jwt_decode(token);
  if (!usuario) return null;
  if (usuario._id !== data.idUser._id) return null;

  const handleClickOpen = () => {
    setOpen(true);
    setNewReply(data.answer);
  };

  const handleClose = () => {
    setOpen(false);
    setNewReply("");
  };

  const getNewReply = (e) => {
    setNewReply(e.target.value);
  };

  const handleSaveReply = async () => {
    setLoading(true);
    await clienteAxios
      .put(
        `/comment/answerQualification/edit/${usuario._id}/${data._id}`,
        { answer: newReply },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        let data = [...reply.data];
        data.splice(index, 1, res.data.answer);
        setReply((prev) => ({
          ...prev,
          data,
        }));
        setLoading(false);
        handleClose();
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
    <Fragment key={data._id}>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <IconButton onClick={handleClickOpen}>
        <Edit />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{"Editar tu respuesta"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder={data.answer}
            variant="outlined"
            value={newReply}
            onChange={getNewReply}
            multiline
            minRows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            cancelar
          </Button>
          <Button
            onClick={handleSaveReply}
            color="primary"
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
