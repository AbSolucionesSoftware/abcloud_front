import React, { useState } from "react";
import { Detector } from "react-detect-offline";
import Box from "@material-ui/core/Box";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { Close, Wifi, WifiOff } from "@material-ui/icons";
import Slide from "@material-ui/core/Slide";

export default function ConexionDetect() {
  const [firstLoad, setLoasetFirstLoad] = useState(true);

  return (
    <Box>
      <Detector
        render={({ online }) => {
          if (online) {
            return firstLoad ? null : <SnackOnline />;
          } else {
            setLoasetFirstLoad(false);
            return <SnackOffline />;
          }
        }}
      />
    </Box>
  );
}

const SnackOnline = () => {
  const [open, setOpen] = useState(true);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={open}
      autoHideDuration={6000}
      TransitionComponent={Slide}
      onClose={() => setOpen(false)}
      message={
        <Box display="flex">
          <Wifi htmlColor="#81c784" />
          <Box mx={1} />
          <Typography>Estas Conectado</Typography>
        </Box>
      }
      action={
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setOpen(false)}
          >
            <Close fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  );
};

const SnackOffline = () => (
  <Snackbar
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    open={true}
    TransitionComponent={Slide}
    message={
      <Box display="flex">
        <WifiOff htmlColor="#bdbdbd" />
        <Box mx={1} />
        <Typography>Sin Conexión</Typography>
      </Box>
    }
  />
);
