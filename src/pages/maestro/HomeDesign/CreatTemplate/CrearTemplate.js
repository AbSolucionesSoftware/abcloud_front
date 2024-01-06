import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import { Add } from "@material-ui/icons";
import CamposSeccion from "./CamposSeccion";

function CrearTemplate({ onUpdate, data }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createTemplate = () => {

    //limpiar cosas que falten limpiar como por ejem,
    // si data es !== a CATEGORY || COURSES,
    //limpiar category y courses
  }



  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        startIcon={<Add />}
        onClick={handleClickOpen}
      >
        Nueva Sección
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title-newtemplate"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle id="dialog-title-newtemplate">
          {onUpdate ? "Actualizar seccion" : "Crear nueva sección"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={5} xs={12}>
              <CamposSeccion />
            </Grid>
            <Grid item md={7} xs={12}>
              preview
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => createTemplate()} color="primary" autoFocus>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CrearTemplate;
