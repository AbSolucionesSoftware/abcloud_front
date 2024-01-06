import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
} from "@material-ui/core";
import React, { useContext, useState } from "react";

import { FacebookShareButton, WhatsappShareButton } from "react-share";
import ShareIcon from "@material-ui/icons/Share";

import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import FacebookIcon from "@material-ui/icons/Facebook";
import { CursoContext } from "../../../../../context/curso_context";
import MetaTags from "react-meta-tags";
import { FileCopy } from "@material-ui/icons";

export default function CompartirTaller({ datosTaller }) {
  const { datos } = useContext(CursoContext);
  var QRCode = require("qrcode.react");
  const [open, setOpen] = useState(false);
  const [messageCopy, setMessageCopy] = useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const copyPortapapeles = (e) => {
    navigator.clipboard.writeText(
      `https://uniline.online/curso_taller/${datos.slug}`
    );
    setMessageCopy(true);
  };

  return (
    <div>
      <MetaTags>
        <title>UNILINE</title>
        <meta id="og-title" property="og:title" content={datos.slug} />
        <meta
          id="og-image"
          property="og:image"
          content={datos?.taller?.urlImageTaller}
        />
        <meta
          id="og-url"
          property="og:url"
          content={`https://uniline.online/curso_taller/${datos.slug}`}
        />
      </MetaTags>
      <Button
        fullWidth
        color="primary"
        style={{ fontSize: 16 }}
        variant="text"
        size="large"
        onClick={() => handleClickOpen()}
        startIcon={<ShareIcon />}
      >
        Compartir
      </Button>
      <Dialog
        open={open}
        onClose={handleClickOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          Comparte este taller por medio de WhatsAp o copiando este enlace, de
          igual manera escaneando el codigo QR
        </DialogTitle>
        <DialogContent>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={messageCopy}
            onClose={() => setMessageCopy(false)}
            message="Copiado a portapapeles"
            key="topCenter"
            autoHideDuration={3000}
          />
          <Box textAlign="center">
            <TextField
              color="primary"
              style={{ width: "80%" }}
              value={`https://uniline.online/curso_taller/${datos.slug}`}
              name="Link"
              id="link"
              variant="outlined"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={(e) => copyPortapapeles(e)}>
                      <FileCopy />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Grid container spacing={3} justify="center">
            <Grid item>
              <Box p={1}>
                <FacebookShareButton
                  url={`https://uniline.online/curso_taller/${datos.slug}`}
                  quote={datosTaller.nameTaller}
                  separator=": "
                >
                  <FacebookIcon style={{ fontSize: 50, color: "#3b5998" }} />
                </FacebookShareButton>
              </Box>
            </Grid>
            <Grid item>
              <Box p={1}>
                <WhatsappShareButton
                  url={`https://uniline.online/curso_taller/${datos.slug}`}
                  title={datosTaller.nameTaller}
                  separator=": "
                >
                  <WhatsAppIcon style={{ fontSize: 50, color: "#00bb2d" }} />
                </WhatsappShareButton>
              </Box>
            </Grid>
          </Grid>
          <Box my={2} mb={3} display="flex" justifyContent="center">
            <QRCode
              size={170}
              value={`https://uniline.online/curso_taller/${datos.slug}`}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
