import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import { Close } from "@material-ui/icons";

function UploadImageCard() {
  return (
    <div>
        <Box my={1} />
      <Box display="flex">
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="banner-file-upload"
          //multiple
          type="file"
        />
        <label htmlFor="banner-file-upload" style={{ width: "100%" }}>
          <Button fullWidth variant="outlined" color="primary" component="span">
            Cargar
          </Button>
        </label>
        <Box mx={0.5} />
        <Button variant="contained" color="secondary" disableElevation>
          <Close />
        </Button>
      </Box>
      <Box my={1} />
      <FormControl variant="outlined" size="small" fullWidth>
        <InputLabel id="select-orientation">Orientación de la imagen</InputLabel>
        <Select
          labelId="select-orientation"
          //value={age}
          //onChange={handleChange}
          label="Orientación de la imagen"
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

export default UploadImageCard;
