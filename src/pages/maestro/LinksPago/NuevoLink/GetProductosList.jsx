import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import clienteAxios from "../../../../config/axios";
import { CircularProgress, InputAdornment } from "@material-ui/core";

export default function GetProductosList({
  setSnackbar,
  typeService,
  setNewLink,
  value,
  disabled = false
}) {
  const [data, setData] = React.useState({ courses: [], packs: [] });
  const [loading, setLoading] = React.useState(true);
  let user = JSON.parse(localStorage.getItem("student"));
  let token = localStorage.getItem("token");
  let idUser = user || user !== null ? user._id : "";

  const getProducts = React.useCallback(async () => {
    await clienteAxios
      .get(`/paymentlink/products/${idUser}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err)
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
  }, [token, idUser, setSnackbar]);

  React.useEffect(() => {
    getProducts();
  }, [getProducts]);

  if (loading) {
    return (
      <Autocomplete
        options={[]}
        fullWidth
        size="small"
        renderInput={(params) => (
          <TextField
            {...params}
            margin="dense"
            label="Producto"
            variant="outlined"
            placeholder="Cargando..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CircularProgress size={20} color="inherit" />
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    );
  }

  const handleChange = (e, option) => {
    if (!option) {
      setNewLink((st) => ({
        ...st,
        idProduct: "",
        product: "",
        description: "",
        price: "",
      }));
      return;
    }
    setNewLink((st) => ({
      ...st,
      idProduct: option._id,
      product: option.title,
      description: option.title,
      price: option.pricePack || option.priceCourse.price,
    }));
  };

  const renderData = (data) => {
    if(!data) return []
    if(typeService ===  'curso') return data.courses 
    if(typeService ===  'pack') return data.packs 
    if(typeService ===  'otro') return []
  }

  return (
    <Autocomplete
      id="combo-box-demo"
      options={renderData(data)}
      isOptionEqualToValue={({ title }, value) => title === value}
      getOptionSelected={(option, value) => option.title === value.title}
      getOptionLabel={(option) => option.title || option || null}
      fullWidth
      disabled={disabled}
      size="small"
      value={value || null}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          margin="dense"
          label="Producto"
          variant="outlined"
          placeholder="Selecciona uno"
        />
      )}
    />
  );
}
