import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import React, { useState } from "react";
import MessageSnackbar from "../../../../../../components/Snackbar/snackbar";
import Spin from "../../../../../../components/Spin/spin";
import clienteAxios from "../../../../../../config/axios";

export default function Eliminar({ usuario, setUpload, upload }) {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const [setResourceDel] = useState({ open: false, resource: "" });
  const [deleteConfimation, setDeleteConfimation] = useState({
    open: false,
    id: "",
  });

  // const handleClick = (resource) => {
  // 	setResourceDel({ open: !resourceDel.open, resource });
  // 	setUpload(true);
  // };

  const handleDeleteConfimation = (idPlatillo) => {
    setDeleteConfimation({ open: !deleteConfimation.open, id: idPlatillo });
    setUpload(true);
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  const eliminarPlatilloBD = async (idPlatillo) => {
    setLoading(true);
    await clienteAxios
      .delete(`/taller/deleteUsersTaller/${idPlatillo}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setUpload(true);
        setLoading(false);
        setResourceDel({ open: false, resource: "" });
        setSnackbar({
          open: true,
          mensaje: "Usuario eliminado exitosamente!.",
          status: "success",
        });
      })
      .catch((err) => {
        setUpload(true);
        setLoading(false);
        setSnackbar({
          open: true,
          mensaje: "Ocurrio un problema en el servidor!.",
          status: "success",
        });
      });
  };

  return (
    <div>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Spin loading={loading} />
      <AlertConfimationDelete
        deleteConfimation={deleteConfimation}
        handleDeleteConfimation={handleDeleteConfimation}
        eliminarPlatilloBD={eliminarPlatilloBD}
      />
      <IconButton
        size="small"
        color="secondary"
        onClick={() => handleDeleteConfimation(usuario)}
      >
        <Delete />
      </IconButton>
    </div>
  );
}

function AlertConfimationDelete({
  deleteConfimation,
  handleDeleteConfimation,
  eliminarPlatilloBD,
}) {
  return (
    <div>
      <Dialog
        open={deleteConfimation.open}
        onClose={handleDeleteConfimation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Estás seguro de eliminar este usuario?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteConfimation} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              handleDeleteConfimation();
              eliminarPlatilloBD(deleteConfimation.id);
            }}
            color="secondary"
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
