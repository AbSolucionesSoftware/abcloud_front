import React, { Fragment } from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import Vimeo from "@u-wave/react-vimeo";

const useStyles = makeStyles((theme) => ({
  background: {
    height: 320,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      height: 240,
    }
  },
  vimeoPlayer: {
    height: "100%",
    width: "100%",
    "& iframe": {
      height: "100%",
      width: "100%",
      backgroundColor: "rgba(0,0,0, 0.9)!important",
    },
  },
}));

function VideoPresentacion({ cursos }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleVideoModal = () => setOpen(!open);

  return (
    <Fragment>
      <Box className={classes.background}>
        <Vimeo
          video={cursos.course.urlCourseVideo}
          autoplay={true}
          onEnd={() => handleVideoModal()}
          id="vimeo-player-description"
          className={classes.vimeoPlayer}
        />
      </Box>
    </Fragment>
  );
}

export default VideoPresentacion;
