import React, { useContext } from "react";
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ExportarExcelEstudiantes from "./ExportarListaEstudiantes";
import TablaUsuariosEstudiantes from "./TablaEstudiantes";
import { UsuariosDashCtx } from "../../../../context/usuariosAdminCtx";
import { useState } from "react";

export default function VistaRegistroEstudiantes() {
  const { setBusqueda, usuarios } = useContext(UsuariosDashCtx);
  const [value, setValue] = useState("");

  const onChangeBusqueda = (e) => setValue(e.target.value);

  const submitSearch = (e) => {
    e.preventDefault();
    setBusqueda(value);
  };

  return (
    <Box>
      <Grid container>
        <Grid item md={6}>
          <form id="student-search" onSubmit={submitSearch}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              onChange={onChangeBusqueda}
              placeholder="Busca un estudiante por nombre, email o número"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" size="small">
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
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Box>
            <ExportarExcelEstudiantes usuarios={usuarios} />
          </Box>
        </Grid>
      </Grid>
      <Box my={2}>
        <TablaUsuariosEstudiantes />
      </Box>
    </Box>
  );
}
