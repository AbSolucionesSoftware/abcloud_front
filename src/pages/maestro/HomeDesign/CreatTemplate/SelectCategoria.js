import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";

function SelectCategoria() {
  return (
    <div>
      <FormControl variant="outlined" size="small" fullWidth>
        <InputLabel id="select-tipo">Categoria</InputLabel>
        <Select
          labelId="select-tipo"
          //value={age}
          //onChange={handleChange}
          label="Categoria"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default SelectCategoria;
