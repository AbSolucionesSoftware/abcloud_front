import React from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { FormControl, InputAdornment, Typography } from "@material-ui/core";
import clienteAxios from "../../../../config/axios";
import { ConsultaContext } from "../Context";
import { formatoMexico } from "../../../../config/reuserFunction";

export default function SelectConsulta() {
  const { appointment, setAppointment } = React.useContext(ConsultaContext);
  const [query, setQuery] = React.useState({
    data: [],
    error: null,
    loading: false,
  });

  const getProducts = React.useCallback(async () => {
    setQuery((st) => ({ ...st, loading: true }));
    await clienteAxios
      .get(`/product/consultoring`)
      .then((res) => {
        setQuery((st) => ({ ...st, loading: false, data: res.data }));
      })
      .catch((error) => {
        setQuery((st) => ({ ...st, loading: false, error }));
      });
  }, []);

  React.useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleSelect = (e, child) => {
    const { value, _id, price } = child.props;
    setAppointment((st) => ({
      ...st,
      product: value,
      idProduct: _id,
      amount: price,
      baseAmount: price,
    }));
  };

  return (
    <FormControl size="small" margin="dense" fullWidth variant="outlined">
      <Select
        value={appointment.product}
        renderValue={(value) => value}
        onChange={(e, child) => handleSelect(e, child)}
        startAdornment={
          <InputAdornment position="start">Servicio: </InputAdornment>
        }
      >
        <MenuItem value="">
          <em>Selecciona uno</em>
        </MenuItem>
        {query.data.map((res, index) => (
          <MenuItem
            key={index}
            value={res.name}
            _id={res._id}
            price={res.price}
          >
            <Typography style={{ flexGrow: 1 }}>{res.name}</Typography>{" "}
            <span>${formatoMexico(res.price)}</span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
