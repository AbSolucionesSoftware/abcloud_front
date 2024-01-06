import React from "react";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import ExportarPagos from "./ExportarExcelCursos";
import { Box, Button } from "@material-ui/core";

export default function FiltrosCursos({ setFiltro }) {
  const [busqueda, setBusqueda] = React.useState("");

  const hanldeChangeInput = (value) => {
    setBusqueda(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!busqueda) {
      setFiltro("");
    }
    setFiltro(busqueda);
  };

  return (
    <Grid container spacing={2} alignItems="center" style={{ width: "100%" }}>
      <Grid item md={6} xs={12}>
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por estudiante, curso, o un cupon de descuento..."
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
      <Grid
        item
        md={6}
        xs={12}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Button startIcon={<CloseIcon />} onClick={() => setFiltro("")}>
          Limpiar filtro
        </Button>
        <Box mx={1} />
        <ExportarPagos />
      </Grid>
    </Grid>
  );
}
