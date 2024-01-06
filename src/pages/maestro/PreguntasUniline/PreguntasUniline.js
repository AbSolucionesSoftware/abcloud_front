import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { Box, Button } from "@material-ui/core";
import Preguntas from "./Preguntas/Preguntas";

const useStyles = makeStyles((theme) => ({
  color: {
    backgroundColor: theme.palette.background.paper,
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  margin: {
    margin: theme.spacing(1),
  },
  iconSave: {
    zIndex: 10,
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(10),
  },
  BoxActions: {
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.background.paper,
    zIndex: 10,
    position: "fixed",
    bottom: theme.spacing(0),
    right: theme.spacing(0),
    width: "100%",
  },
  contenedor: {
    padding: theme.spacing(5),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(1),
    },
  },
}));

export default function PreguntasUniline() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(!open);
  };

  return (
    <Box>
      <Box className={classes.contenedor}>
        <Box>
          <Button
            startIcon={<AddIcon style={{ fontSize: 30 }} />}
            variant="text"
            color="primary"
            className="addButton"
            onClick={handleClickOpen}
          >
            Nueva pregunta
          </Button>
        </Box>
        <Preguntas open={open} setOpen={setOpen} />
      </Box>
    </Box>
  );
}
