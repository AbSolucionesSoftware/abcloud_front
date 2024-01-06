import { Box, Dialog, Typography } from "@material-ui/core";
import Warning from "@material-ui/icons/Warning";
import React from "react";
import RegistroAlterno from "../../RegistroAlterno/registro_alterno";

function DialogRegistro({ handleModal, open, error, setError }) {
  const handleClose = () => {
    handleModal();
    localStorage.removeItem("coupon");
    localStorage.removeItem("cart");
    localStorage.removeItem("free");
    localStorage.removeItem("buy");
    localStorage.removeItem("pack");

    setError({ error: false, message: "" });
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      fullWidth
    >
      {!error.error ? (
        <RegistroAlterno handleClose={handleClose} />
      ) : error.message.response ? (
        <Box m={5} display="flex" alignItems="center">
          <Warning
            style={{ fontSize: 70, marginRight: 10 }}
            color="error"
          />
          <Box>
            <Typography variant="h6">Lo sentimos</Typography>
            <Typography variant="h5">
              {error.message.response.data.message}
            </Typography>
          </Box>
        </Box>
      ) : (
        <div>hubo un error desconocido</div>
      )}
    </Dialog>
  );
}

export default DialogRegistro;
