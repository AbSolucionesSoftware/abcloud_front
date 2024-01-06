import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import ImagenCertificado from "../../../images/ejemplo_cert.png";
import { Box } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UbicacionNumeroCertificado() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="text"
        size="medium"
        color="primary"
        onClick={handleClickOpen}
        style={{textTransform: "none"}}
      >
        ¿Dónde encuentro mi numero de certificado?
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="d-description-certificate"
      >
        <DialogContent>
          <DialogContentText id="d-description-certificate">
            Tu número de certificado se encuentra en la parta inferior derecha, como se muestra en la siguiente imagen
          </DialogContentText>
          <Box height="100%" width="100%" display="flex" justifyContent="center" alignItems="center">
              <img alt="ubicacion numero certificado" src={ImagenCertificado} style={{maxHeight: "100%", maxWidth: "100%"}} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
