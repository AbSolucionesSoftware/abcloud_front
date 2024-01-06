import React, { useContext } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import UploadBanner from "./UploadBanner";
import UploadImageCard from "./UploadImageCard";
import { TemplateAdminCtx } from "../../../../context/makingTemplateAdmin";
import CampoVariable from "./CampoVariable";

function CamposSeccion() {
  const { template, setTemplate } = useContext(TemplateAdminCtx);

  const obtenerChecks = (e) => {
    const { name, checked } = e.target;

    console.log(name, checked)
    let data = { ...template, [name]: checked };
    if (!checked && [name] === "show_title") {
      data.title = "";
    } else if (!checked && [name] === "show_cards") {
      data.data = "";
    }
    setTemplate(data);
  };

  const obtenerTextFields = (e) => {
    const { name, value } = e.target;
    setTemplate({
      ...template,
      [name]: value,
    });
  };

  return (
    <div>
      <Box my={1}>
        <FormControlLabel
          control={
            <Checkbox
              checked={template.show_title}
              onChange={obtenerChecks}
              name="show_title"
            />
          }
          label={
            <Typography>
              <b>Titulo de la sección</b>
            </Typography>
          }
        />
        <TextField
          name="title"
          variant="outlined"
          fullWidth
          size="small"
          onChange={obtenerTextFields}
          value={template.title}
          disabled={!template.show_title}
        />
      </Box>
      <Box my={1}>
        <UploadBanner />
      </Box>
      <Box my={1}>
        <Box display="flex">
          <FormControlLabel
            control={
              <Checkbox
                checked={template.show_cards}
                onChange={obtenerChecks}
                name="show_cards"
              />
            }
            label={
              <Typography>
                <b>Mostrar cards</b>
              </Typography>
            }
          />
          <RadioGroup
            row
            name="only_cards"
            value={template.only_cards}
            onChange={obtenerTextFields}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Solo cards"
              disabled={!template.show_cards}
            />
            <FormControlLabel
              value="false"
              control={<Radio color="primary" />}
              label="Con imagen"
              disabled={!template.show_cards}
            />
          </RadioGroup>
        </Box>
        <Box>
          <FormControl variant="outlined" size="small" fullWidth name="data" disabled={!template.show_cards}>
            <InputLabel id="select-tipo">Que mostrará esta sección</InputLabel>
            <Select
              labelId="select-tipo"
              value={template.data}
              onChange={obtenerTextFields}
              label="Que mostrara esta seccion"
              name="data"
            >
              <MenuItem value="">
                <em>Selecciona una</em>
              </MenuItem>
              <MenuItem value="PACK">PACK</MenuItem>
              <MenuItem value="CATEGORY">CATEGORY</MenuItem>
              <MenuItem value="OFFER">OFFER</MenuItem>
              <MenuItem value="FREE">FREE</MenuItem>
              <MenuItem value="CURSOS">CURSOS</MenuItem>
            </Select>
          </FormControl>
          <Box my={1} />
          <CampoVariable  value={template.data} />
        </Box>
        <UploadImageCard />

        <Box my={1}>
          <TextField
            name="url_redirection"
            variant="outlined"
            fullWidth
            size="small"
            label="url a redireccionar"
          />
        </Box>
      </Box>
    </div>
  );
}

export default CamposSeccion;
