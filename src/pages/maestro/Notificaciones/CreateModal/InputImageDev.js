import React, { useCallback } from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { useDropzone } from "react-dropzone";
import { Alert, AlertTitle } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  imagen: {
    maxHeight: "100%",
    maxWidth: "100%",
  },
  dropZone: {
    border: "dashed 2px",
    borderColor: "#aaaaaa",
  },
}));

export default function InputImageDev({
  values,
  setValues,
  previewDevices,
  setPreviewDevices,
}) {
  const classes = useStyles();

  const onDrop = useCallback(
    (files) => {
      setPreviewDevices(URL.createObjectURL(files[0]));
      setValues({
        ...values,
        image_devices: files,
      });
    },
    [values, setValues, setPreviewDevices]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeImage = () => {
    setValues({
      ...values,
      image_devices: "",
    });
    setPreviewDevices("");
  };

  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      <Box>
        <Alert severity="info" icon={false}>
          <AlertTitle>Para dispositivos moviles</AlertTitle>
          Este aparecera en dispositivos como tablets y smartphones
        </Alert>
      </Box>
      <Box
        className={previewDevices ? "" : classes.dropZone}
        {...getRootProps()}
        height={120}
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <input disabled={values.isModal} {...getInputProps()} />
        {values.image_devices || previewDevices ? (
          <Box
            height={120}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <img
              alt="imagen del curso"
              src={previewDevices}
              className={classes.imagen}
            />
          </Box>
        ) : isDragActive ? (
          <Typography>Suelta tú imagen aquí...</Typography>
        ) : (
          <Typography>
            haz clic aquí o arrastra tu imagen y suelta aquí
          </Typography>
        )}
      </Box>
      <Button
        fullWidth
        variant="text"
        color="primary"
        size="small"
        onClick={() => removeImage()}
        disabled={values.isModal}
      >
        Eliminar imagen
      </Button>
    </Box>
  );
}
