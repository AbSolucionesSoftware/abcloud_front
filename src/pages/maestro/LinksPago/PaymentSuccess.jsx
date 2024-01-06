import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  useTheme,
} from "@material-ui/core";
import CheckCircleTwoToneIcon from "@material-ui/icons/CheckCircleTwoTone";
import PlayCircleFilledWhiteIcon from "@material-ui/icons/PlayCircleFilledWhite";
import clienteAxios from "../../../config/axios";
import { Link } from "react-router-dom";
import PDFSuccesPayment from "./Factura/PDFSuccess";
import { GetApp } from "@material-ui/icons";
import html2pdf from "html2pdf.js";

export default function PaymentLinkSuccess(props) {
  const { idPaymentLink } = props.match.params;
  const theme = useTheme();
  const [paymentLink, setPaymentLink] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingDownload, setLoadingDownload] = useState(false);

  const getPaymentLink = useCallback(async () => {
    await clienteAxios
      .get(`/paymentlink/${idPaymentLink}`)
      .then(async (response) => {
        setPaymentLink(response.data.response);
        await clienteAxios
          .post(`/paymentlink/success/finishprocess/${idPaymentLink}`)
          .then(async (res) => {
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            console.log({ errorFinish: err });
          });
      })
      .catch((err) => {
        setLoading(false);
        console.log({ errorGet: err });
      });
  }, [idPaymentLink]);

  const downloadPDF = async () => {
    try {
      setLoadingDownload(true);
      const element = document.getElementById("pdf-nota-link-success");
      const pdf = await html2pdf().from(element).outputPdf("datauristring");
      await fetch(pdf)
        .then((res) => res.blob())
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `${paymentLink.typePayment} ${paymentLink.product}(PAGADO).pdf`;
          link.click();
          URL.revokeObjectURL(blobUrl);
          setLoadingDownload(false);
        });
    } catch (error) {
      console.log("Error al generar PDF: ", error);
      setLoadingDownload(false);
    }
  };

  useEffect(() => {
    getPaymentLink();
  }, [getPaymentLink]);

  if (loading) {
    return (
      <Box
        height="60vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size={40} color="primary" />
        <Typography>Espera un momento por favor</Typography>
      </Box>
    );
  }
  if (!paymentLink) return null;

  return (
    <Box
      minHeight="70vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{ backgroundColor: theme.palette.background.paper }}
    >
      <Container maxWidth="md">
        <Container maxWidth="md">
          <Box
            pt={3}
            px={5}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <CheckCircleTwoToneIcon
              style={{ fontSize: 30, color: theme.palette.success.light }}
            />
            <Box mx={1} />
            <Typography variant="h6">
              <b>Pago realizado</b>
            </Typography>
            <Box flexGrow={1} />
            <Box display="flex" justifyContent="center">
              <Button
                size="small"
                onClick={downloadPDF}
                style={{ textTransform: "none" }}
                startIcon={
                  loadingDownload ? <CircularProgress size={20} /> : <GetApp />
                }
              >
                Guardar PDF
              </Button>
              <Box mx={1} />
              <Button
                color="primary"
                size="small"
                disableElevation
                style={{ textTransform: "none" }}
                startIcon={<PlayCircleFilledWhiteIcon />}
                component={Link}
                to="/mis_cursos"
              >
                Ir a mis cursos
              </Button>
            </Box>
          </Box>
        </Container>

        <Box display="flex" justifyContent="center">
          <PDFSuccesPayment data={paymentLink} />
        </Box>
      </Container>
    </Box>
  );
}
