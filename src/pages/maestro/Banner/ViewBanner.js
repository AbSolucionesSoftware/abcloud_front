import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import Close from "@material-ui/icons/Close";
import { Box, makeStyles } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    maxHeight: "100%",
    maxWidth: "100%",
  },
});

export default function ViewBanner({ banner }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton size="small" color="default" onClick={handleClickOpen}>
        <AspectRatioIcon />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          style={{ padding: 0, display: "flex", justifyContent: "flex-end" }}
        >
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <Box className={classes.container}>
          <img
            alt={`imagen banner ${banner.key_desktop}`}
            src={banner.image_desktop}
            className={classes.image}
          />
        </Box>
      </Dialog>
    </div>
  );
}
