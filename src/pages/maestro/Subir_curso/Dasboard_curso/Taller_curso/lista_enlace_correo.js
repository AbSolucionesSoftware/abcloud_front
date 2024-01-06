import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Divider } from "@material-ui/core";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import DragIndicatorOutlinedIcon from "@material-ui/icons/DragIndicatorOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const reorder = (list, startIndex, endIndex) => {
  const newList = Array.from(list);
  const [removed] = newList.splice(startIndex, 1);
  newList.splice(endIndex, 0, removed);
  return newList;
};

export default function EnlacesCorreo({
  datosEnlaces,
  setDatosEnlaces,
  eliminarRespuesta,
}) {
  const classes = useStyles();

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const new_elements = reorder(datosEnlaces, source.index, destination.index);
    setDatosEnlaces(new_elements);
  };

  const respuestas_aprendizajes = datosEnlaces.map((res, index) => {
    return (
      <Draggable draggableId={`aprendizaje-${index}`} index={index} key={index}>
        {(provided) => (
          <Box ref={provided.innerRef} {...provided.draggableProps}>
            <Paper className={classes.root} variant="outlined">
              <InputBase
                className={classes.input}
                value={res.tituloEnlace ? res.tituloEnlace : ""}
                inputProps={{ readOnly: true }}
              />
              <InputBase
                className={classes.input}
                value={res.enlace ? res.enlace : ""}
                inputProps={{ readOnly: true }}
              />
              <Divider className={classes.divider} orientation="vertical" />
              <IconButton
                className={classes.iconButton}
                aria-label="delete"
                onClick={() => eliminarRespuesta(index)}
              >
                <DeleteOutlinedIcon />
              </IconButton>
              <IconButton
                className={classes.iconButton}
                {...provided.dragHandleProps}
              >
                <DragIndicatorOutlinedIcon />
              </IconButton>
            </Paper>
          </Box>
        )}
      </Draggable>
    );
  });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-learnings">
        {(provided) => (
          <Box my={2} ref={provided.innerRef}>
            {respuestas_aprendizajes}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
}
