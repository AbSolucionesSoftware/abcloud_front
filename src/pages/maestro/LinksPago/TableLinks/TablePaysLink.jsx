import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  formatoFechaCurso,
  formatoMexico,
} from "../../../../config/reuserFunction";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  TablePagination,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  CheckCircle,
  FileCopyOutlined,
  Info,
  WhatsApp,
} from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaypal, faStripe } from "@fortawesome/free-brands-svg-icons";
import DetailInvoice from "../Factura/Factura";

const useStyles = makeStyles({
  table: {
    height: "72vh",
    overflowX: "scroll",
    width: "93vw",
  },
});

export default function TableStripe({ query, page, setPage, setSnackbar }) {
  const { data, loading, error } = query;
  const classes = useStyles();

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
  if (error) {
    return (
      <Box
        height="60vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Info size={40} color="primary" />
        <Typography>Hubo un error</Typography>
      </Box>
    );
  }

  return (
    <Paper variant="outlined">
      <TableContainer className={classes.table}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">Factura</TableCell>
              <TableCell>Enlace de pago</TableCell>
              <TableCell style={{ minWidth: 120 }}>Fecha</TableCell>
              <TableCell padding="checkbox">Metodo</TableCell>
              <TableCell style={{ minWidth: 120 }}>Status</TableCell>
              <TableCell style={{ minWidth: 250 }}>Producto</TableCell>
              <TableCell style={{ minWidth: 120 }}>Servicio</TableCell>
              <TableCell style={{ minWidth: 150 }}>Costo</TableCell>
              <TableCell style={{ minWidth: 200 }}>Usuario</TableCell>
              <TableCell style={{ minWidth: 130 }}>Telefono</TableCell>
              <TableCell style={{ minWidth: 130 }}>Correo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.docs?.map((row) => (
              <RenderRows key={row._id} row={row} setSnackbar={setSnackbar} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={data.totalDocs}
        rowsPerPage={data.limit}
        page={page - 1}
        onPageChange={(_, nextPage) => setPage(nextPage + 1)}
      />
    </Paper>
  );
}

const RenderRows = ({ row, setSnackbar }) => {
  const [open, setOpen] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(row.url);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  return (
    <TableRow key={row._id}>
      <TableCell padding="checkbox">
        <DetailInvoice data={row} setSnackbar={setSnackbar} />
      </TableCell>
      <TableCell>
        <Box
          display="flex"
          border={1}
          borderColor="divider"
          bgcolor="#F6F8FA"
          borderRadius={3}
        >
          <Typography
            style={{ width: 300, marginRight: 8 }}
            color="textSecondary"
            noWrap
          >
            {row.url}
          </Typography>
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
            <IconButton size="small" onClick={handleCopy}>
              <FileCopyOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton
            size="small"
            href={`https://wa.me/${row?.user?.phone}?text=${row.url}`}
            target="_blank"
            disabled={!row?.user?.phone}
          >
            <WhatsApp fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
      <TableCell>{formatoFechaCurso(row.createdAt)}</TableCell>
      <TableCell>
        {row.typePayment === "STRIPE" ? (
          <FontAwesomeIcon
            icon={faStripe}
            style={{
              fontSize: "28px",
              color: "#5433FF",
            }}
          />
        ) : (
          <FontAwesomeIcon
            icon={faPaypal}
            style={{
              fontSize: "20px",
              color: "#009cde",
            }}
          />
        )}
      </TableCell>
      <TableCell>
        {row.statusPay ? (
          <Chip
            label="Pagado"
            size="small"
            style={{
              backgroundColor: "#6fbf73",
              color: "white",
              fontWeight: "bold",
            }}
          />
        ) : (
          <Chip
            label="En espera"
            size="small"
            style={{
              fontWeight: "bold",
            }}
          />
        )}
      </TableCell>
      <TableCell>{row.product}</TableCell>
      <TableCell>{row.typeService}</TableCell>
      <TableCell>{`$${formatoMexico(
        row.total
      )} ${row.currency.toUpperCase()}`}</TableCell>
      <TableCell>{row.user?.name}</TableCell>
      <TableCell>{row.user?.phone}</TableCell>
      <TableCell>{row.user?.email}</TableCell>
    </TableRow>
  );
};
