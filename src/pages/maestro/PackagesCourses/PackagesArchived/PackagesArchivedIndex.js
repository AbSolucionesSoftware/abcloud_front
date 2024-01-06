import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import DialogTitle from "@material-ui/core/DialogTitle";
import ArchiveIcon from "@material-ui/icons/Archive";
import ItemPackage from "../ListPackages/ItemCard/ItemPackage";
import { PackageCtx } from "../PackagesCtx";
import { Box, Typography } from "@material-ui/core";
import { Inbox } from "@material-ui/icons";

export default function PackagesArchivedIndex() {
  const [open, setOpen] = React.useState(false);
  const { packagesArchived } = React.useContext(PackageCtx);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="text"
        color="inherit"
        onClick={handleClickOpen}
        startIcon={<ArchiveIcon />}
      >
        Archivados
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-archived"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle id="modal-archived">Paquetes Archivados</DialogTitle>
        <DialogContent style={{ height: "60vh" }}>
          {!packagesArchived.length ? (
            <Box
              height="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <Inbox color="disabled" style={{ fontSize: 100 }} />
              <Typography variant="h6">No tienes paquetes archivados</Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {packagesArchived.map((res, index) => (
                <Grid key={index} item md={3} sm={6} xs={12}>
                  <ItemPackage data={res} archived={true} />
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
