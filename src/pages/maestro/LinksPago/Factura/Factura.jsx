import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Box from "@material-ui/core/Box";
import DialogContent from "@material-ui/core/DialogContent";
import { AlternateEmail, Close, GetApp, Receipt } from "@material-ui/icons";
import { CircularProgress, IconButton } from "@material-ui/core";
import PDFNotaLink from "./PDFLink";
import DetailStripe from "./DetailStripe";
import DetailPaypal from "./DetailPaypal";
import html2pdf from "html2pdf.js";
import clienteAxios from "../../../../config/axios";

export default function DetailInvoice({ data, setSnackbar }) {
  const [open, setOpen] = React.useState(false);
  const [loadingDownload, setLoadingDownload] = React.useState(false);
  const [loadingSend, setLoadingSend] = React.useState(false);
  let token = localStorage.getItem("token");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const downloadPDF = async () => {
    try {
      setLoadingDownload(true);
      const element = document.getElementById("pdf-nota-link");
      const pdfResult = await html2pdf()
        .from(element)
        .outputPdf("datauristring");
      await fetch(pdfResult)
        .then((res) => res.blob())
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `${data.typePayment} ${data.product}.pdf`;
          link.click();
          URL.revokeObjectURL(blobUrl);
          setLoadingDownload(false);
        });
    } catch (error) {
      console.log("Error al generar PDF: ", error);
      setLoadingDownload(false);
      setSnackbar({
        open: true,
        mensaje: "Al parecer hubo un error al enviar",
        status: "error",
      });
    }
  };

  const sendPDF = async () => {
    try {
      setLoadingSend(true);
      const element = document.getElementById("pdf-nota-link");

      const pdfResult = await html2pdf()
        .from(element)
        .outputPdf("datauristring");
      //const blob = new Blob([pdfResult], { type: "application/pdf" });

      await fetch(pdfResult)
        .then((res) => res.blob())
        .then(async (blob) => {
          const formData = new FormData();
          formData.append("pdf", blob, "documento.pdf");

          const response = await clienteAxios.post(
            `/paymentlink/send/${data._id}`,
            formData,
            {
              headers: {
                Authorization: `bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setLoadingSend(false);
          setSnackbar({
            open: true,
            mensaje: response.data.message,
            status: "success",
          });
          setLoadingDownload(false);
        })
        .catch((err) => {
          console.log("Error al enviar PDF: ", err);
          setLoadingSend(false);
          setSnackbar({
            open: true,
            mensaje: "Al parecer hubo un error al enviar",
            status: "error",
          });
        });
    } catch (error) {
      console.log("Error al generar PDF: ", error);
      setLoadingSend(false);
      setSnackbar({
        open: true,
        mensaje: "Al parecer hubo un error al enviar",
        status: "error",
      });
    }
  };

  return (
    <div>
      <IconButton variant="outlined" onClick={handleClickOpen}>
        <Receipt />
      </IconButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle component="div" style={{ padding: "8px 24px 0px 24px" }}>
          <Box display="flex" alignItems="center">
            {data.typePayment === "STRIPE" ? (
              <DetailStripe data={data} setSnackbar={setSnackbar} />
            ) : (
              <DetailPaypal data={data} setSnackbar={setSnackbar} />
            )}
            <Box flexGrow={1} />
            <Button
              size="small"
              onClick={downloadPDF}
              startIcon={
                loadingDownload ? <CircularProgress size={20} /> : <GetApp />
              }
            >
              descargar
            </Button>
            <Box mx={1} />
            <Button
              size="small"
              startIcon={
                loadingSend ? (
                  <CircularProgress size={20} />
                ) : (
                  <AlternateEmail />
                )
              }
              onClick={sendPDF}
            >
              Enviar email
            </Button>
            <Box mx={1} />
            <Button size="small" startIcon={<Close />} onClick={handleClose}>
              Cerrar
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent
          style={{
            padding: "0 24px 0 24px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <PDFNotaLink data={data} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
