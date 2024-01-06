import React, { useContext } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { Close } from "@material-ui/icons";
import { TemplateAdminCtx } from "../../../../context/makingTemplateAdmin";

function UploadBanner() {
  const { template, setTemplate, setPreviewBanner } = useContext(
    TemplateAdminCtx
  );

  const obtenerChecks = (e) => {
    const { name, checked } = e.target;
    let data = {
      ...template,
      [name]: checked,
    };
    if (!checked) {
      data.banner = "";
      setPreviewBanner("");
    }
    setTemplate(data);
  };

  const obtenerImagen = (e) => {
    const { files } = e.target;
    setTemplate({
      ...template,
      banner: files[0],
    });
    setPreviewBanner(URL.createObjectURL(files[0]));
  };

  console.log(template);

  const deleteImagen = () => {
    setTemplate({
      ...template,
      banner: "",
    });
    setPreviewBanner("");
  };

  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={template.show_banner}
            onChange={obtenerChecks}
            name="show_banner"
          />
        }
        label={
          <Typography>
            <b>Banner principal</b>
          </Typography>
        }
      />
      <Box display="flex">
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="banner-file-upload"
          type="file"
          onChange={obtenerImagen}
        />
        <label htmlFor="banner-file-upload" style={{ width: "100%" }}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            component="span"
            disabled={!template.show_banner}
          >
            <Typography noWrap variant="button"> {template.banner.name ? template.banner.name : "Cargar"}</Typography>
          </Button>
        </label>
        <Box mx={0.5} />
        <Button
          variant="contained"
          color="secondary"
          disableElevation
          onClick={() => deleteImagen()}
        >
          <Close />
        </Button>
      </Box>
    </div>
  );
}

export default UploadBanner;
