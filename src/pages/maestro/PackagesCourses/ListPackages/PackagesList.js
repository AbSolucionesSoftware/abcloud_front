import React from "react";
import Box from "@material-ui/core/Box";
import clienteAxios from "../../../../config/axios";
import InboxIcon from "@material-ui/icons/Inbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import ItemPackage from "./ItemCard/ItemPackage";
import { PackageCtx } from "../PackagesCtx";

export default function PackagesList() {
  const token = localStorage.getItem("token");
  const student = JSON.parse(localStorage.getItem("student"));
  const [packages, setPackages] = React.useState([]);
  const { updateQuery, setSnackbar, setPackagesArchived } = React.useContext(PackageCtx);
  const [loading, setLoading] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const getPackagesCourses = React.useCallback(async () => {
    if (!student._id) return;
    setLoading(true);
    await clienteAxios
      .get(`/packages/${student._id}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setPackages(res.data.packages);
        setPackagesArchived(res.data.packagesArchived);
      })
      .catch((err) => {
        if (err.response) {
          setSnackbar({
            open: true,
            mensaje: err.response.data.message,
            status: "error",
          });
        } else {
          setSnackbar({
            open: true,
            mensaje: "Al parecer no se a podido conectar al servidor.",
            status: "error",
          });
        }
      })
      .finally(() => {
        setLoading(false);
        setLoaded(true);
      });
  }, [token, student._id, setSnackbar, setPackagesArchived]);

  React.useEffect(() => {
    getPackagesCourses();
  }, [getPackagesCourses, updateQuery]);

  if (loading) {
    return (
      <Box
        height="50vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <CircularProgress size={70} color="primary" />
        <Typography variant="h6">Cargando...</Typography>
      </Box>
    );
  }
  if (loaded && !packages.length) {
    return (
      <Box
        height="50vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <InboxIcon color="disabled" style={{ fontSize: 100 }} />
        <Typography variant="h6">Aun no tienes paquetes</Typography>
      </Box>
    );
  }

  return (
    <div>
      <Box py={2}>
        <Grid container spacing={2}>
          {packages.map((res, index) => (
            <Grid key={index} item xl={3} md={4} sm={6} xs={12}>
              <ItemPackage data={res} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}
