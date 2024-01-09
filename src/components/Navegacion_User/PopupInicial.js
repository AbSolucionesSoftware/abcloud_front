import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import { Box, Hidden, IconButton, makeStyles } from "@material-ui/core";
import { Close } from "@material-ui/icons";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  container: {
    height: 200,
    paddingBottom: 20,
  },
  title: {
    width: "100%",
    lineHeight: 1.2,
    fontSize: "20px",
    bottom: 0,
  },
  description: {
    marginTop: 8,
    lineHeight: 1.2,
    fontSize: "20px",
  },
}));

export default function PopupModalPrincipal({ ready }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [dataModal, setDataModal] = React.useState(null);
  const [vermas, setVermas] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(
      "modal_abcloud",
      JSON.stringify([{ ...dataModal, open: true }])
    );
  };

  useEffect(() => {
    const modal = JSON.parse(localStorage.getItem("modal_abcloud"));
    if (modal && !modal[0].open) {
      setDataModal(modal[0]);
      setTimeout(() => {
        setOpen(true);
      }, 1200);
    }
  }, [ready]);

  if (!dataModal) return null;

  return (
    <div>
      <Hidden smDown>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth="md"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="50vh"
            onClick={() => {
              if (dataModal.url) {
                window.open(dataModal.url, "_blank");
                handleClose();
              }
            }}
          >
            {dataModal.image ? (
              <img
                alt="modal abcloud"
                src={dataModal.image}
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />
            ) : null}
          </Box>
          {dataModal.title ? (
            <DialogTitle>{dataModal.title}</DialogTitle>
          ) : null}
          {dataModal.description ? (
            <DialogContent>
              <Typography>{dataModal.description}</Typography>
            </DialogContent>
          ) : null}
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Hidden>
      <Hidden mdUp>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth="xs"
          scroll="paper"
          style={{ zIndex: 999999 }}
        >
          <DialogTitle style={{padding: 0,display: "flex", justifyContent: "flex-end"}}>
            <IconButton onClick={() => handleClose()}>
              <Close />
            </IconButton>
          </DialogTitle>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100vh"
            onClick={() => {
              if (dataModal.url) {
                window.open(dataModal.url, "_blank");
                handleClose();
              }
            }}
          >
            {dataModal.image_devices ? (
              <img
                alt="modal abcloud"
                src={dataModal.image_devices}
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />
            ) : null}
          </Box>
          <DialogContent>
            <div className={classes.container}>
              <Box className={classes.title}>
                {dataModal.title ? dataModal.title : null}
              </Box>
              {vermas ? (
                <Box className={classes.description}>
                  {dataModal.description ? dataModal.description : null}
                </Box>
              ) : null}
              <Box my={1} pb={2}>
              <Typography align="center" onClick={() => setVermas(!vermas)}>
                {vermas ? "ver menos" : "ver más"}
              </Typography>
              </Box>
            </div>
          </DialogContent>
        </Dialog>
      </Hidden>
    </div>
  );
}
