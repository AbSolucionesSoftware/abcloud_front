import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import ExportarPagos from "./ExportarExcel";

export default function FiltrosVentasMaestro({ filtro, setFiltro }) {
  const [busqueda, setBusqueda] = React.useState("");

  const handleChangeFiltro = (e) => {
    const { value, name } = e.target;
    switch (name) {
      case "all":
        setFiltro({ field: "", search: "" });
        break;
      case "paypal":
        setFiltro({ field: "typePay", search: value });
        break;
      case "stripe":
        setFiltro({ field: "typePay", search: value });
        break;
      case "failed":
        setFiltro({ field: "statusPay", search: value === "true" });
        break;

      default:
        setFiltro({ field: "", search: "" });
        break;
    }
  };

  const hanldeChangeInput = (value) => {
    setBusqueda(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!busqueda) {
      setFiltro({ field: "", search: "" });
    }
    setFiltro({ field: "nameUser", search: busqueda });
  };

  return (
    <Grid container spacing={2} alignItems="center" style={{ width: "100%" }}>
      <Grid item lg={5} md={4} sm={12} xs={12}>
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por estudiante"
            value={busqueda}
            onChange={(e) => hanldeChangeInput(e.target.value)}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="center">
                  <IconButton type="submit">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </Grid>
      <Grid item lg={5} md={6} sm={9} xs={12}>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="position"
            name="position"
            value={filtro.search}
            onChange={handleChangeFiltro}
          >
            <FormControlLabel
              value=""
              name="all"
              control={<Radio color="primary" />}
              label="Todas"
            />
            <FormControlLabel
              value="paypal"
              name="paypal"
              control={<Radio color="primary" />}
              label="Paypal"
            />
            <FormControlLabel
              value="stripe"
              name="stripe"
              control={<Radio color="primary" />}
              label="Stripe"
            />
            <FormControlLabel
              value={false}
              name="failed"
              control={<Radio color="primary" />}
              label="Fallidos"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid
        item
        lg={2}
        md={2}
        sm={3}
        xs={12}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <ExportarPagos />
      </Grid>
    </Grid>
  );
}
