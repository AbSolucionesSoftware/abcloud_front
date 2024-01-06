import React from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { formatoMexico } from "../../../../config/reuserFunction";
import moment from "moment";
import DehazeIcon from "@material-ui/icons/Dehaze";
import { Box, Typography } from "@material-ui/core";
import { CheckCircleTwoTone, ErrorTwoTone } from "@material-ui/icons";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DetallePagoModal({ sale }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton
        size="small"
        variant="outlined"
        color="inherit"
        onClick={handleClickOpen}
      >
        <DehazeIcon />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="dialog-detalles-payment"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="dialog-detalles-payment">Datalle de pago</DialogTitle>
        <DialogContent>
          <TablaVentaComponent sale={sale} />
          <Box mt={2}>
            <Box my={2}>
              <Typography variant="h6">Detalle de la compra</Typography>
            </Box>
            {sale.courses.length ? (
              <TablaCursosComponent sale={sale} />
            ) : (
              <TablaServiceComponent sale={sale} />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const TablaVentaComponent = ({ sale }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small" stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell width={100}>Fecha</TableCell>
            <TableCell width={260}>Nombre comprador</TableCell>
            <TableCell width={150}>Método de pago</TableCell>
            <TableCell width={150}>Estado de pago</TableCell>
            <TableCell width={160}>Servicio adquirido</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{moment(sale.createdAt).format("DD/MM/YYYY")}</TableCell>
            <TableCell>{sale.nameUser}</TableCell>
            <TableCell>{sale.typePay}</TableCell>
            <TableCell>
              <span style={{ display: "flex" }}>
                {sale.statusPay ? (
                  <CheckCircleTwoTone
                    htmlColor="green"
                    style={{ fontSize: 20 }}
                  />
                ) : (
                  <ErrorTwoTone color="error" style={{ fontSize: 20 }} />
                )}
                <Typography variant="body2" style={{ marginLeft: 6 }}>
                  {sale.comment}
                </Typography>
              </span>
            </TableCell>
            <TableCell>
              {sale.typeService ? sale.typeService : "Curso"}
            </TableCell>
            <TableCell>$ {formatoMexico(sale.total)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const TablaCursosComponent = ({ sale }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small" stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Curso</TableCell>
            <TableCell>Precio del curso</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sale.courses.map((curso, index) => (
            <TableRow key={index}>
              <TableCell>{curso.idCourse.title}</TableCell>
              <TableCell>
                ${" "}
                {formatoMexico(
                  curso.pricePromotionCourse
                    ? curso.pricePromotionCourse
                    : curso.priceCourse
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const TablaServiceComponent = ({ sale }) => {
  const { idService } = sale;
  if (!idService) {
    return (
      <Box>
        <Typography color="textSecondary">No hay detalles </Typography>
        <Typography color="textSecondary" variant="body2">
          Probablemente este pago fue realizado mediante los enlaces de pago
          con el tipo de artículo "otro" y no esta relacionado a un producto de
          Uniline
        </Typography>
        
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small" stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Nombre servicio</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Precio</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{idService.name ? idService.name : ""}</TableCell>
            <TableCell>
              {idService.description ? idService.description : ""}
            </TableCell>
            <TableCell>{idService.type ? idService.type : ""}</TableCell>
            <TableCell>
              ${idService.price ? formatoMexico(idService.price) : ""}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
