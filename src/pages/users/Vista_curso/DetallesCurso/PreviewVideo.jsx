import React, { useState } from "react";
import { Button, Dialog, Hidden, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Vimeo from "@u-wave/react-vimeo";
import { Close, PlayCircleFilled } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  vimeoPlayer: {
    height: "70vh",
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#151515",
    display: "flex",
    alignItems: "flex-end",
    "& iframe": {
      height: "95%",
      width: "100%",
      backgroundColor: "#151515!important",
    },
    [theme.breakpoints.down("sm")]: {
      height: "50vh",
    },
    [theme.breakpoints.down("xs")]: {
      height: "30vh",
    },
  },
}));

export default function PreviewVideo({ topic }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!topic.preview || !topic.keyTopicVideo) return null;

  return (
    <>
      <Hidden xsDown>
        <Button
          color="primary"
          size="small"
          startIcon={<PlayCircleFilled />}
          onClick={() => handleClickOpen()}
        >
          Vista previa
        </Button>
      </Hidden>
      <Hidden smUp>
        <IconButton color="primary" onClick={() => handleClickOpen()}>
          <PlayCircleFilled />
        </IconButton>
      </Hidden>
      <Dialog onClose={() => handleClose()} open={open} fullWidth maxWidth="md">
        <IconButton
          style={{ position: "absolute", right: 0 }}
          onClick={() => handleClose()}
        >
          <Close htmlColor="white" />
        </IconButton>
        <Vimeo
          video={topic.keyTopicVideo}
          autoplay={true}
          onEnd={() => handleClose()}
          id="vimeo-player-description"
          className={classes.vimeoPlayer}
        />
      </Dialog>
    </>
  );
}
