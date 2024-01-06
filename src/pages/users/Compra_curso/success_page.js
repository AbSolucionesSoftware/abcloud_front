import React, { useCallback, useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { formatoMexico } from "../../../config/reuserFunction";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaypal, faStripe } from "@fortawesome/free-brands-svg-icons";
import CheckCircleTwoToneIcon from "@material-ui/icons/CheckCircleTwoTone";
import PlayCircleFilledWhiteIcon from "@material-ui/icons/PlayCircleFilledWhite";
import clienteAxios from "../../../config/axios";
import { Link } from "react-router-dom";
import { AlternateEmail, GetApp } from "@material-ui/icons";
import html2pdf from "html2pdf.js";
import UnilineIcon from "../../../images/unilineAzul.png";
import MessageSnackbar from "../../../components/Snackbar/snackbar";

const useStyles = makeStyles((theme) => ({
  imagen: {
    maxHeight: "100%",
    maxWidth: "100%",
  },
  imgContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const initial_snack = {
  open: false,
  mensaje: "",
  status: "",
};

export default function PagoSuccess(props) {
  const idPago = props.match.params.idPago;
  const theme = useTheme();
  const token = localStorage.getItem("token");
  const [pago, setPago] = useState([]);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [snackbar, setSnackbar] = React.useState(initial_snack);

  const obtenerPago = useCallback(async () => {
    await clienteAxios
      .get(`/pay/${idPago}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setPago(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, idPago]);

  useEffect(() => {
    obtenerPago();
  }, [obtenerPago]);

  if (pago?.courses?.length === 0) return null;
  if (!token || token === null) props.history.push("/");

  const downloadPDF = async () => {
    try {
      setLoadingDownload(true);
      const element = document.getElementById("pdf-nota-curso-success");
      const pdf = await html2pdf().from(element).outputPdf("datauristring");
      await fetch(pdf)
        .then((res) => res.blob())
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `Recibo pago Uniline.pdf`;
          link.click();
          URL.revokeObjectURL(blobUrl);
          setLoadingDownload(false);
        });
    } catch (error) {
      console.log("Error al generar PDF: ", error);
      setLoadingDownload(false);
    }
  };

  const sendPDF = async () => {
    try {
      setLoadingSend(true);
      const element = document.getElementById("pdf-nota-curso-success");
      const pdf = await html2pdf().from(element).outputPdf("datauristring");
      await fetch(pdf)
        .then((res) => res.blob())
        .then(async (blob) => {
          const formData = new FormData();
          formData.append("pdf", blob, "documento.pdf");

          const response = await clienteAxios.post(
            `/pay/send/${pago._id}`,
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
    <Box
      minHeight="70vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{ backgroundColor: theme.palette.background.paper }}
    >
      <Container maxWidth="md">
	  <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
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
                size="small"
                onClick={sendPDF}
                style={{ textTransform: "none" }}
                startIcon={
                  loadingSend ? (
                    <CircularProgress size={20} />
                  ) : (
                    <AlternateEmail />
                  )
                }
              >
                Enviar por correo
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
          <PDFSuccesPayment data={pago} />
        </Box>
      </Container>
    </Box>
  );
}

const PDFSuccesPayment = ({ data }) => {
  const classes = useStyles();
  return (
    <Box
      id="pdf-nota-curso-success"
      mb={2}
      style={{ /* height: "297mm", */ width: "210mm" }}
    >
      <Box p={2}>
        <Typography variant="h4">
          <b>Factura</b>
        </Typography>
        <Box my={2}>
          <Box display="flex">
            <Box flexGrow={1}>
              {data.typePay === "stripe" ? (
                <FontAwesomeIcon
                  icon={faStripe}
                  style={{
                    fontSize: "72px",
                    color: "#5433FF",
                  }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faPaypal}
                  style={{
                    fontSize: "54px",
                    color: "#009cde",
                  }}
                />
              )}
            </Box>
            <Box width={160} className={classes.imgContent}>
              <img alt="uniline" src={UnilineIcon} className={classes.imagen} />
            </Box>
          </Box>
          <Box mt={1} />
          <Typography style={{ lineHeight: 0.7 }}>
            <b>Facturado a:</b>
          </Typography>
          <Typography>{data.nameUser}</Typography>
          <Box mt={1} />
          <Typography style={{ lineHeight: 0.7 }}>
            <b>Fecha de emisión:</b>
          </Typography>
          <Typography style={{ wordWrap: "break-word" }}>
            {moment(data.createtAt).format("LL")}
          </Typography>
        </Box>
        <Box mt={3}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography>
                      <b>Artículo</b>
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>
                      <b>Cantidad</b>
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>
                      <b>Precio</b>
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>
                      <b>Descuento</b>
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>
                      <b>Total</b>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.courses?.map((res, index) => {
                  const {
                    pricePromotionCourse,
                    priceCourse,
                    persentagePromotion,
                  } = res;
                  return (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {res.idCourse.title}
                      </TableCell>
                      <TableCell align="right">1</TableCell>
                      <TableCell align="right">
                        ${formatoMexico(priceCourse, 2)}
                      </TableCell>
                      <TableCell align="right">
                        %{persentagePromotion}
                      </TableCell>
                      <TableCell align="right">
                        ${formatoMexico(pricePromotionCourse || priceCourse, 2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Typography>
                      <b>Total</b>
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>
                      <b>${formatoMexico(data.total, 2)}</b>
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Typography>
                      <b>Saldo pagado</b>
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>
                      <b>${formatoMexico(data.total, 2)}</b>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box mt={4}>
          <Typography style={{ lineHeight: 0.7 }}>
            <b>Notas:</b>
          </Typography>
          <Typography>{data.notes}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
