import { Dialog, DialogActions, DialogTitle, Button } from "@material-ui/core";
import React from "react";

export default function DeleteConfirmDialog({
  title,
  dataDelete,
  openDialogDelete,
  handleChangeDialogDelete,
  handleClickFunctionAction,
}) {
  return (
    <div>
      <Dialog
        open={openDialogDelete}
        onClose={handleChangeDialogDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`¿Estás seguro de eliminar la ${title} ?`}</DialogTitle>
        <DialogActions>
          <Button onClick={handleChangeDialogDelete} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              handleChangeDialogDelete();
              handleClickFunctionAction(dataDelete._id);
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
