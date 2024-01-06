import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Slide from "@material-ui/core/Slide";
import { Add, Done } from "@material-ui/icons";
import {
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import GetProductosList from "./GetProductosList";
import clienteAxios from "../../../../config/axios";
import GetUsersList from "./GetUsersList";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const initState = {
  idProduct: "",
  product: "",
  description: "",
  typePayment: "STRIPE",
  typeService: "curso",
  price: "",
  quantity: 1,
  currency: "mxn",
  user: {
    idUser: "",
    name: "",
    phone: "",
    email: "",
  },
};

export default function NuevoEnlacePago({
  setSnackbar,
  setUpdate,
  setResponse,
}) {
  const [open, setOpen] = React.useState(false);
  const [newLink, setNewLink] = React.useState(initState);
  const [loading, setLoading] = React.useState(false);
  let token = localStorage.getItem("token");

  const handleClickOpen = () => {
    setOpen(true);
    setNewLink(initState);
  };

  const handleClose = () => {
    setOpen(false);
    setNewLink(initState);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewLink((st) => ({ ...st, [name]: value }));
  };

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setNewLink((st) => ({ ...st, user: { ...st.user, [name]: value } }));
  };

  const handleChangeTypeService = (event) => {
    const { name, value } = event.target;
    setNewLink((st) => ({
      ...st,
      [name]: value,
      product: "",
      description: "",
      price: "",
    }));
  };

  const handleCreate = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const type = newLink.typePayment.toLowerCase();
      const res = await clienteAxios.post(
        `/paymentlink/${type}/create`,
        newLink,
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );
      setLoading(false);
      setUpdate((update) => !update);
      handleClose();
      setResponse({
        open: true,
        success: true,
        data: res.data.data,
      });
    } catch (err) {
      setLoading(false);
      if (err.response) {
        setSnackbar({
          open: true,
          mensaje: err.response.data.message,
          status: "error",
        });
      } else {
        setSnackbar({
          open: true,
          mensaje: "Al parecer no se a podido conectar al servidor.",
          status: "error",
        });
      }
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        disableElevation
        color="primary"
        startIcon={<Add />}
        onClick={() => handleClickOpen()}
      >
        Nuevo
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Crear nuevo enlace de pago</DialogTitle>
        <DialogContent>
          <form id="form-newlink" onSubmit={handleCreate}>
            <Grid container spacing={3}>
              <Grid item md={6}>
                <Typography>Datos de la factura</Typography>
                <FormControl variant="outlined" fullWidth margin="dense">
                  <InputLabel id="label-newP">Plataforma</InputLabel>
                  <Select
                    labelId="label-newP"
                    value={newLink.typePayment}
                    onChange={handleChange}
                    label="Plataforma"
                    name="typePayment"
                    required
                  >
                    <MenuItem value="STRIPE">STRIPE</MenuItem>
                    <MenuItem value="PAYPAL">PAYPAL</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="outlined" fullWidth margin="dense">
                  <InputLabel id="label-newP">Tipo artículo</InputLabel>
                  <Select
                    labelId="label-newP"
                    value={newLink.typeService}
                    onChange={handleChangeTypeService}
                    label="Para que es"
                    name="typeService"
                    required
                  >
                    <MenuItem value="curso">CURSO</MenuItem>
                    <MenuItem value="pack">PACK DE CURSOS</MenuItem>
                    <MenuItem value="otro">OTRO</MenuItem>
                  </Select>
                </FormControl>
                <GetUsersList
                  setSnackbar={setSnackbar}
                  setNewLink={setNewLink}
                  value={newLink.user.name}
                  disabled={newLink.typeService === "otro"}
                />
                <TextField
                  label="Nombre cliente"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="name"
                  value={newLink.user.name}
                  onChange={handleUserChange}
                  margin="dense"
                  required
                  disabled={newLink.user.idUser}
                />
                <TextField
                  label="Correo electrónico"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="email"
                  value={newLink.user.email}
                  onChange={handleUserChange}
                  margin="dense"
                  required
                  disabled={newLink.user.idUser}
                />
                <TextField
                  label="Número de telefono"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="phone"
                  value={newLink.user.phone}
                  onChange={handleUserChange}
                  margin="dense"
                  required
                  disabled={newLink.user.idUser}
                />
              </Grid>
              <Grid item md={6}>
                <Typography>Datos del artículo</Typography>
                <GetProductosList
                  setSnackbar={setSnackbar}
                  typeService={newLink.typeService}
                  setNewLink={setNewLink}
                  value={newLink.product}
                  disabled={newLink.typeService === "otro"}
                />
                <TextField
                  label="Nombre del artículo"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="product"
                  value={newLink.product}
                  onChange={handleChange}
                  margin="dense"
                  required
                  disabled={newLink.idProduct}
                />
                <TextField
                  label="Descripción"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                  name="description"
                  value={newLink.description}
                  onChange={handleChange}
                  margin="dense"
                />
                <TextField
                  label="Precio"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="price"
                  value={newLink.price}
                  onChange={handleChange}
                  margin="dense"
                  required
                  type="number"
                  InputProps={{ startAdornment: "$" }}
                />
                <FormControl variant="outlined" fullWidth margin="dense">
                  <InputLabel id="label-currency">Moneda</InputLabel>
                  <Select
                    labelId="label-currency"
                    value={newLink.currency}
                    onChange={handleChange}
                    label="Moneda"
                    name="currency"
                    required
                  >
                    <MenuItem value="mxn">MXN</MenuItem>
                    <MenuItem value="usd">USD</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Nota (opcional)"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="notes"
                  value={newLink.notes}
                  onChange={handleChange}
                  margin="dense"
                  multiline
                  minRows={3}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            type="submit"
            form="form-newlink"
            color="primary"
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Done />
              )
            }
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
