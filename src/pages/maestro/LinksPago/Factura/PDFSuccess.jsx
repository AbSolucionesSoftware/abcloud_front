import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { formatoMexico } from "../../../../config/reuserFunction";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaypal, faStripe } from "@fortawesome/free-brands-svg-icons";

export default function PDFSuccesPayment({ data }) {
  return (
    <Box
      id="pdf-nota-link-success"
      mb={2}
      style={{ /* height: "297mm", */ width: "210mm" }}
    >
      <Box p={2}>
        <Typography variant="h4">
          <b>Factura</b>
        </Typography>
        <Box my={2}>
          {data.typePayment === "STRIPE" ? (
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
          <Typography style={{ lineHeight: 0.7 }}>
            <b>ID {data.typePayment}</b>
          </Typography>
          <Typography style={{ wordWrap: "break-word" }}>
            {data.paymentID}
          </Typography>
          <Box mt={1} />
          <Typography style={{ lineHeight: 0.7 }}>
            <b>Facturado a:</b>
          </Typography>
          <Typography>{data.user?.name}</Typography>
          <Box mt={1} />
          <Typography style={{ lineHeight: 0.7 }}>
            <b>Fecha de emisión:</b>
          </Typography>
          <Typography style={{ wordWrap: "break-word" }}>
            {moment(data.createtAt).format("LL")}
          </Typography>
          <Box mt={1} />
          <Typography style={{ lineHeight: 0.7 }}>
            <b>Fecha de pago:</b>
          </Typography>
          <Typography style={{ wordWrap: "break-word" }}>
            {moment().format("LL")}
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
                      <b>Tarifa</b>
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
                <TableRow>
                  <TableCell component="th" scope="row">
                    {data.product}
                  </TableCell>
                  <TableCell align="right">{data.quantity}</TableCell>
                  <TableCell align="right">
                    ${formatoMexico(data.total, 2)}
                  </TableCell>
                  <TableCell align="right">
                    ${formatoMexico(data.total, 2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} align="right">
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
                  <TableCell colSpan={3} align="right">
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
}
