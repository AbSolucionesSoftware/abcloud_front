import React, { useContext } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import { TemplateAdminCtx } from "../../../../context/makingTemplateAdmin";

function CampoVariable({value}) {
  const { template, setTemplate, /* cursos, */ categorias } = useContext(
    TemplateAdminCtx
  );

  const obtenerCategoria = (e) => {
    const { value } = e.target;
    setTemplate({
      ...template,
      category: value,
    });
  };

  /* const obtenerCurso = (e) => {
    const { value } = e.target;
    setTemplate({
      ...template,
      [name]: value,
    });
  }; */

  switch (template.data) {
    case "PACK":
      return null;
    case "OFFER":
      return null;
    case "FREE":
      return null;
    case "CATEGORY":
      return (
        <div>
          <FormControl
            variant="outlined"
            size="small"
            fullWidth
            name="category"
          >
            <InputLabel id="select-category">Selecciona una categoria</InputLabel>
            <Select
              labelId="select-category"
              value={template.category}
              onChange={obtenerCategoria}
              label="Selecciona una categoria"
              name="category"
            >
              <MenuItem value="">
                <em>Selecciona una categoria</em>
              </MenuItem>
              {categorias.map((res, index) => (
                <MenuItem key={index} value={res.category}>
                  {res.category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      );
    case "CURSOS":
      return (
        <div>
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel id="select-tipo">titulo variable</InputLabel>
            <Select
              labelId="select-tipo"
              value={template.data}
              onChange={(e) => console.log(e)}
              label="titulo variable"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="PACK">PACK</MenuItem>
              <MenuItem value="CATEGORY">CATEGORY</MenuItem>
              <MenuItem value="OFFER">OFFER</MenuItem>
              <MenuItem value="FREE">FREE</MenuItem>
              <MenuItem value="CURSOS">CURSOS</MenuItem>
            </Select>
          </FormControl>
        </div>
      );
    default:
      return null;
  }
}

export default CampoVariable;
