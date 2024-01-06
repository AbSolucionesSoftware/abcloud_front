import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import { Box, CircularProgress, Tooltip, Typography } from "@material-ui/core";
import {
  AlternateEmail,
  CheckCircle,
  CheckCircleTwoTone,
  FileCopyOutlined,
  GetApp,
  WhatsApp,
} from "@material-ui/icons";
import clienteAxios from "../../../../config/axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogResult({ response, setResponse, setSnackbar }) {
  const [open, setOpen] = React.useState(false);
  const [loadingDownload, setLoadingDownload] = React.useState(false);
  const [loadingSend, setLoadingSend] = React.useState(false);
  let token = localStorage.getItem("token");

  const handleClose = () => {
    setResponse({
      open: false,
      data: null,
      success: false,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response?.data?.url);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  const downloadPDF = async (data) => {
    setLoadingDownload(true);
    await clienteAxios
      .get(`/paymentlink/download/${data._id}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
        responseType: "blob",
      })
      .then(async (res) => {
        setLoadingDownload(false);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `${data.typePayment} ${data.product}.pdf`;
        document.body.appendChild(a);
        a.click();
        // Elimina el objeto URL y el enlace
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((err) => {
        console.log(err);
        setLoadingDownload(false);
        setSnackbar({
          open: true,
          mensaje: "Al parecer hubo un error al descargar",
          status: "error",
        });
      });
  };

  const sendPDF = async (data) => {
    setLoadingSend(true);
    await clienteAxios
      .post(
        `/paymentlink/send`,
        { idPaymentLink: data._id },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then(async (res) => {
        setLoadingSend(false);
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
      })
      .catch((err) => {
        console.log(err);
        setLoadingSend(false);
        setSnackbar({
          open: true,
          mensaje: "Al parecer hubo un error al enviar",
          status: "error",
        });
      });
  };

  return (
    <div>
      <Dialog
        open={response.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        {response.data ? (
          <DialogContent>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <CheckCircleTwoTone style={{ fontSize: 30 }} color="primary" />
              <Typography>Link de pago creado</Typography>
            </Box>
            <br />
            <Box display="flex" justifyContent="center">
              <Tooltip
                open={open}
                arrow
                title={
                  <Box display="flex">
                    <CheckCircle htmlColor="#5cb85c" />
                    <Typography>Copiado</Typography>
                  </Box>
                }
              >
                <Button
                  disabled={!response?.data}
                  onClick={handleCopy}
                  startIcon={<FileCopyOutlined />}
                >
                  Copy
                </Button>
              </Tooltip>

              <Box mx={1} />
              <Button
                startIcon={<WhatsApp />}
                href={`https://wa.me/${response?.data?.user?.phone}?text=${response?.data?.url}`}
                target="_blank"
                disabled={!response?.data?.user?.phone}
              >
                Enviar
              </Button>
              <Box mx={1} />
              <Button
                onClick={() => sendPDF(response?.data)}
                startIcon={
                  loadingSend ? (
                    <CircularProgress size={20} />
                  ) : (
                    <AlternateEmail fontSize="small" />
                  )
                }
                disabled={!response?.data?.user?.email}
              >
                Enviar
              </Button>
              <Box mx={1} />
              <Button
                onClick={() => downloadPDF(response?.data)}
                startIcon={
                  loadingDownload ? (
                    <CircularProgress size={20} />
                  ) : (
                    <GetApp fontSize="small" />
                  )
                }
                disabled={!response?.data}
              >
                PDF
              </Button>
            </Box>
            <br />
            <Box
              style={{
                display: "inline-block",
                wordWrap: "break-word",
                whiteSpace: "normal",
                width: "100%",
              }}
            >
              <Typography variant="caption" align="center">
                {response?.data?.url}
              </Typography>
            </Box>
          </DialogContent>
        ) : null}

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
