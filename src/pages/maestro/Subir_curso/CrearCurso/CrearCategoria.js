import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Add, Close, Done } from "@material-ui/icons";
import clienteAxios from "../../../../config/axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CrearCategoriaNuevoCurso({
  update,
  setUpdate,
  setSnackbar,
  datos,
  setDatos,
  categories,
  setCategories,
}) {
  const [open, setOpen] = React.useState(false);
  const [categorie, setCategorie] = useState("");
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const cleanStates = () => {
    setCategorie("");
    setSubcategorias([]);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    cleanStates();
  };

  const nuevaSubCategoria = () => {
    setSubcategorias([...subcategorias, { subCategorie: "" }]);
  };

  const removeSubCategoria = (index) => {
    const subs = [...subcategorias];
    subs.splice(index, 1);
    setSubcategorias(subs);
  };

  const onChangeCategory = (value) => {
    const categoria = capitalizarPrimeraLetra(value);
    setCategorie(categoria);
  };

  const onChangeSubcategory = (value, index) => {
    const subCategorie = capitalizarPrimeraLetra(value);
    const subs = [...subcategorias];
    subs.splice(index, 1, { subCategorie });
    setSubcategorias(subs);
  };

  function capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleSubmit = async () => {
    //verificar subcategorias vacias
    const subCategories = subcategorias.filter((res) => res.subCategorie);
    let data = { categorie };
    if (subCategories.length > 0) {
      data.subCategories = subCategories;
    }

    setLoading(true);
    await clienteAxios
      .post(`/categories/`, data, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
        setDatos({
          ...datos,
          category: categorie,
          subCategory: "",
        });
        setCategories([
          { categorie: "", subCategories: [{ subcategorie: "" }] },
        ]);
        setUpdate(!update);
        handleClose();
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
      <IconButton variant="contained" color="primary" onClick={handleClickOpen}>
        <Add />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        aria-labelledby="new-category"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="new-category">Nueva categoria</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Categoria"
            variant="outlined"
            onChange={(e) => onChangeCategory(e.target.value)}
            value={categorie}
          />
          <Box my={2}>
            <Button
              variant="text"
              color="primary"
              startIcon={<Add />}
              onClick={nuevaSubCategoria}
            >
              Subcategoria
            </Button>

            {subcategorias.map((res, index) => (
              <Box my={1} key={index}>
                <InputSubcategoriasRender
                  index={index}
                  subcategorie={res}
                  removeSubCategoria={removeSubCategoria}
                  onChangeSubcategory={onChangeSubcategory}
                />
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button
            disabled={loading}
            onClick={() => handleSubmit()}
            color="primary"
            startIcon={
              loading ? (
                <CircularProgress color="inherit" size={20} />
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

const InputSubcategoriasRender = ({
  subcategorie,
  index,
  removeSubCategoria,
  onChangeSubcategory,
}) => {
  return (
    <TextField
      fullWidth
      label="Categoria"
      variant="outlined"
      onChange={(e) => onChangeSubcategory(e.target.value, index)}
      value={subcategorie.subCategorie}
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">
            <IconButton onClick={(e) => removeSubCategoria(index)}>
              <Close />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
