import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Collapse,
  CardActions,
  Container,
} from "@material-ui/core";
import clsx from "clsx";
import AddIcon from "@material-ui/icons/Add";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DragIndicatorOutlinedIcon from "@material-ui/icons/DragIndicatorOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Temas from "./temas";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import clienteAxios from "../../../../../config/axios";
import Spin from "../../../../../components/Spin/spin";
import MessageSnackbar from "../../../../../components/Snackbar/snackbar";
import { CursoContext } from "../../../../../context/curso_context";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const useStyles = makeStyles((theme) => ({
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

const reorder = (list, startIndex, endIndex) => {
  const newList = Array.from(list);
  const [removed] = newList.splice(startIndex, 1);
  newList.splice(endIndex, 0, removed);
  return newList;
};

export default function Bloques({ bloques, setBloques, open, setOpen }) {
  const { datos, update, setUpdate } = useContext(CursoContext);
  const token = localStorage.getItem("token");
  const [openNewTheme, setOpenNewTheme] = useState(false);
  const [datosBloque, setDatosBloque] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });
  const [action, setAction] = useState(false);

  const handleClickOpen = (action, block) => {
    if (action === "edit") {
      setAction(true);
      setDatosBloque({
        ...datosBloque,
        _id: block._id,
        blockTitle: block.blockTitle,
      });
      setOpen(!open);
      return;
    }
    setAction(false);
    setOpen(!open);
  };

  const handleClickOpenTema = () => {
    setOpenNewTheme(!openNewTheme);
  };

  const obtenerNombrebloque = (e) => {
    if (action) {
      setDatosBloque({
        ...datosBloque,
        [e.target.name]: e.target.value,
      });
      return;
    }
    if (bloques.length === 0) {
      setDatosBloque({
        ...datosBloque,
        [e.target.name]: e.target.value,
        preference: 1,
      });
    } else {
      const preference = bloques[bloques.length - 1].block.preference + 1;
      setDatosBloque({
        ...datosBloque,
        [e.target.name]: e.target.value,
        preference: preference,
      });
    }
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

  const guardarBloqueBD = async () => {
    if (!datosBloque.blockTitle) {
      return;
    }
    handleClickOpen();
    setLoading(true);
    if (action) {
      await clienteAxios
        .put(`/course/block/edit/${datosBloque._id}`, datosBloque, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          messages("success", res.data.message);
          setUpdate(!update);
        })
        .catch((err) => {
          setLoading(false);
          messages("error", err);
        });
    } else {
      await clienteAxios
        .post(`/course/block/${datos._id}`, datosBloque, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          messages("success", res.data.message);
          setUpdate(!update);
        })
        .catch((err) => {
          setLoading(false);
          messages("error", err);
        });
    }
  };

  const eliminarBloqueBD = async (idBloque) => {
    setLoading(false);
    await clienteAxios
      .delete(`/course/block/delete/${idBloque}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        messages("success", res.data.message);
        setUpdate(!update);
      })
      .catch((err) => {
        setLoading(false);
        messages("error", err);
      });
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const new_elements = reorder(bloques, source.index, destination.index);
    setBloques(new_elements);
  };

  const renderBloques = bloques.map((bloque, index) => {
    return (
      <RenderBlock
        key={bloque.block._id}
        index={index}
        bloque={bloque}
        bloques={bloques}
        setBloques={setBloques}
        handleClickOpen={handleClickOpen}
        handleClickOpenTema={handleClickOpenTema}
        openNewTheme={openNewTheme}
        setOpenNewTheme={setOpenNewTheme}
        eliminarBloqueBD={eliminarBloqueBD}
      />
    );
  });

  return (
    <Box>
      <Spin loading={loading} />
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-blocks">
          {(provided) => (
            <Box ref={provided.innerRef}>
              {renderBloques}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <Dialog
        open={open}
        onClose={handleClickOpen}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">Nuevo bloque</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Escribe el nombre de tu nuevo bloque.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="blockTitle"
            label="Nombre del bloque"
            defaultValue={action === true ? datosBloque.blockTitle : ""}
            fullWidth
            onChange={obtenerNombrebloque}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickOpen} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => guardarBloqueBD()}
            color="primary"
            variant="contained"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function RenderBlock({
  index,
  bloque,
  bloques,
  setBloques,
  handleClickOpen,
  handleClickOpenTema,
  openNewTheme,
  setOpenNewTheme,
  eliminarBloqueBD,
}) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const block = bloque.block;
  const [deleteConfimation, setDeleteConfimation] = useState({
    open: false,
    id: "",
  });
  /* const [ temas, setTemas ] = useState(bloque.topics); */

  const handleDeleteConfimation = (idBlock) => {
    setDeleteConfimation({ open: !deleteConfimation.open, id: idBlock });
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Draggable draggableId={`block-${block._id}`} index={index}>
      {(provided) => (
        <Box
          my={1}
          ref={provided.innerRef}
          {...provided.draggableProps} /* {...provided.dragHandleProps} */
        >
          <AlertConfimationDelete
            deleteConfimation={deleteConfimation}
            handleDeleteConfimation={handleDeleteConfimation}
            eliminarBloqueBD={eliminarBloqueBD}
          />
          <Card variant="outlined">
            <CardActions disableSpacing style={{ padding: 0 }}>
              <Grid container spacing={1}>
                <Grid
                  item
                  xs={12}
                  sm={8}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleExpandClick()}
                >
                  <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded,
                    })}
                    size="medium"
                    //onClick={() => handleExpandClick()}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                  <Typography variant="h6">{`Bloque ${index + 1}: ${
                    block.blockTitle
                  }`}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" justifyContent="flex-end">
                    <IconButton onClick={() => handleClickOpen("edit", block)}>
                      <EditOutlinedIcon />
                    </IconButton>
                    {bloque.topics.length === 0 ? (
                      <IconButton
                        onClick={() => handleDeleteConfimation(block._id)}
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    ) : null}
                    <IconButton {...provided.dragHandleProps}>
                      <DragIndicatorOutlinedIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent style={{ padding: 0 }}>
                <Container maxWidth="xl">
                  <Grid container>
                    <Grid item>
                      <Button
                        startIcon={<AddIcon />}
                        size="large"
                        variant="text"
                        color="primary"
                        className="addButton"
                        onClick={() => handleClickOpenTema()}
                      >
                        Nuevo tema
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Temas
                        openNewTheme={openNewTheme}
                        setOpenNewTheme={setOpenNewTheme}
                        bloque={bloque}
                        bloques={bloques}
                        setBloques={setBloques}
                        /* temas={temas} */
                        /* setTemas={setTemas} */
                      />
                    </Grid>
                  </Grid>
                </Container>
              </CardContent>
            </Collapse>
          </Card>
        </Box>
      )}
    </Draggable>
  );
}

function AlertConfimationDelete({
  deleteConfimation,
  handleDeleteConfimation,
  eliminarBloqueBD,
}) {
  return (
    <div>
      <Dialog
        open={deleteConfimation.open}
        onClose={handleDeleteConfimation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Estás seguro de eliminar este bloque?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteConfimation} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              handleDeleteConfimation();
              eliminarBloqueBD(deleteConfimation.id);
            }}
            color="secondary"
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
