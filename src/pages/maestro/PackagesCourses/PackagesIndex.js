import React, { useContext } from "react";
import Box from "@material-ui/core/Box";
import CrearPackage from "./CrearPaquetes/CrearPackage";
import PackagesList from "./ListPackages/PackagesList";
import MessageSnackbar from "../../../components/Snackbar/snackbar";
import { PackageCtx, PackagesProvider } from "./PackagesCtx";
import PackagesArchivedIndex from "./PackagesArchived/PackagesArchivedIndex";
import { Hidden } from "@material-ui/core";

export default function PackagesIndex() {
  return (
    <PackagesProvider>
      <ComponentToRender />
    </PackagesProvider>
  );
}

const ComponentToRender = () => {
  const { snackbar, setSnackbar } = useContext(PackageCtx);
  return (
    <div>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Hidden smDown>
        <Box display="flex" position="absolute" top={64} right={20}>
          <PackagesArchivedIndex />
          <Box mx={1} />
          <CrearPackage />
        </Box>
      </Hidden>
      <Hidden mdUp>
        <Box display="flex" justifyContent="flex-end">
          <PackagesArchivedIndex />
          <Box mx={1} />
          <CrearPackage />
        </Box>
      </Hidden>
      <Box>
        <PackagesList />
      </Box>
    </div>
  );
};
