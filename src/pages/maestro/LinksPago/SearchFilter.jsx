import { TextField } from "@material-ui/core";
import React from "react";

export default function SearchFilter({filter, setFilter}) {
  return (
    <TextField
      placeholder="Buscar enlace de pago"
      variant="outlined"
      size="small"
      fullWidth
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
    />
  );
}
