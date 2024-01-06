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
import { Add, Done, Edit } from "@material-ui/icons";
import { CircularProgress, IconButton, TextField } from "@material-ui/core";
import clienteAxios from "../../../config/axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const initState = {
  name: "",
  description: "",
  type: "",
  image: "",
  price: "",
};

export default function NewProduct({ data, setSnackbar, setUpdate }) {
  const [open, setOpen] = React.useState(false);
  const [product, setProduct] = React.useState(initState);
  const [loading, setLoading] = React.useState(false);
  let user = JSON.parse(localStorage.getItem("student"));
  let token = localStorage.getItem("token");

  const handleClickOpen = () => {
    setOpen(true);
    if (data) {
      const { _id, ...newdata } = data;
      setProduct(newdata);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setProduct(initState);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct((st) => ({ ...st, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!product.type || !product.name || !product.price) setLoading(true);
    await clienteAxios
      .post(`/product/${user._id}`, product, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setUpdate((update) => !update);
        handleClose();
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
      })
      .catch((err) => {
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
      });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!product.type || !product.name || !product.price) return;
    setLoading(true);
    await clienteAxios
      .put(`/product/action/${data._id}`, product, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setUpdate((update) => !update);
        handleClose();
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
      })
      .catch((err) => {
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
      });
  };

  return (
    <div>
      {data ? (
        <IconButton onClick={() => handleClickOpen()}>
          <Edit />
        </IconButton>
      ) : (
        <Button
          variant="contained"
          disableElevation
          color="primary"
          startIcon={<Add />}
          onClick={() => handleClickOpen()}
        >
          Nuevo
        </Button>
      )}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="newProduct-dialog"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="newProduct-dialog">
          {data ? `Editar: ${data.name}` : "Nuevo producto"}
        </DialogTitle>
        <DialogContent>
          <FormControl variant="outlined" fullWidth margin="dense">
            <InputLabel id="label-newP">Tipo</InputLabel>
            <Select
              labelId="label-newP"
              value={product.type}
              onChange={handleChange}
              label="Tipo"
              name="type"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="CONSULTORIA">CONSULTORIA</MenuItem>
              <MenuItem value="SOFTWARE">SOFTWARE</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Nombre"
            variant="outlined"
            size="small"
            fullWidth
            name="name"
            value={product.name}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            label="Descripción"
            variant="outlined"
            size="small"
            fullWidth
            name="description"
            value={product.description}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            label="Precio"
            variant="outlined"
            size="small"
            fullWidth
            name="price"
            value={product.price}
            onChange={handleChange}
            margin="dense"
            type="number"
            InputProps={{ startAdornment: "$" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={!data ? handleCreate : handleEdit}
            form="form-producto"
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
