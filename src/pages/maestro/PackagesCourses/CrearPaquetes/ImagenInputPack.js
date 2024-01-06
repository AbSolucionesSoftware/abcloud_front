import React, { Fragment, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Typography } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import { PackageCtx } from "../PackagesCtx";
import { Delete } from "@material-ui/icons";

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

export default function ImagenInputPack() {
  const classes = useStyles();
  const { packageObj, setPackage, preview, setPreview } = React.useContext(
    PackageCtx
  );

  const onDrop = useCallback(
    (files) => {
      setPreview(URL.createObjectURL(files[0]));
      setPackage({
        ...packageObj,
        image: files[0],
      });
    },
    [packageObj, setPackage, setPreview]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const eliminarImagen = () => {
    setPreview("");
    setPackage({
      ...packageObj,
      image: "",
    });
  };

  return (
    <Fragment>
      <Box
        className={classes.dropZone}
        {...getRootProps()}
        height={120}
        display="flex"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <input {...getInputProps()} />
        {packageObj.image || preview ? (
          <Box
            height={120}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <img
              alt="imagen del curso"
              src={preview}
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
      <Fragment>
        <Box display="flex" justifyContent="flex-end">
          <Button
            color="primary"
            startIcon={<Delete />}
            onClick={() => eliminarImagen()}
          >
            eliminar imagen
          </Button>
        </Box>
      </Fragment>
    </Fragment>
  );
}
