import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import clienteAxios from "../../../../config/axios";
import { CircularProgress, InputAdornment } from "@material-ui/core";
import { useDebounce } from "use-debounce";

export default function GetUsersList({
  setSnackbar,
  setNewLink,
  value,
  disabled = false,
}) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  let token = localStorage.getItem("token");
  const [input, setInput] = React.useState("");
  const [SEARCH] = useDebounce(input, 800);

  React.useEffect(() => {
    const getUsers = async () => {
      await clienteAxios
        .get(`/paymentlink/users/get?search=${SEARCH}`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
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
    getUsers();
  }, [SEARCH, setSnackbar, token]);

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
            label="Usuario uniline"
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
        user: {
          idUser: "",
          name: "",
          email: "",
          phone: "",
        },
      }));
      return;
    }
    setNewLink((st) => ({
      ...st,
      user: {
        idUser: option._id,
        name: option.name,
        email: option.email,
        phone: option.phone || "",
      },
    }));
  };

  const handleClosePopup = () => {
    if (!value) setInput("");
  };

  return (
    <Autocomplete
      options={data}
      isOptionEqualToValue={(option, value) => option?.name === value}
      getOptionSelected={(option, value) => option?.name === value.name}
      getOptionLabel={(option) => option?.name || option || null}
      fullWidth
      disabled={disabled}
      size="small"
      onClose={handleClosePopup}
      value={value || null}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          margin="dense"
          onChange={(e) => setInput(e.target.value)}
          label="Usuario uniline"
          value={input}
          variant="outlined"
          placeholder="Buscar por nombre, telefono o email"
        />
      )}
    />
  );
}
