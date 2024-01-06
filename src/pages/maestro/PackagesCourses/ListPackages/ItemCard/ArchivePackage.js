import React from "react";
import ArchiveIcon from "@material-ui/icons/Archive";
import Button from "@material-ui/core/Button";
import { PackageCtx } from "../../PackagesCtx";
import clienteAxios from "../../../../../config/axios";
import { CircularProgress } from "@material-ui/core";

export default function ArchivePackage({ data }) {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = React.useState(false);
  const { updateQuery, setSnackbar, setUpdateQuery } = React.useContext(
    PackageCtx
  );

  const publicarPackage = async () => {
    const datos = { archived: !data.archived, active: false };
    setLoading(true);
    const formData = new FormData();
    formData.append("archived", datos.archived);
    await clienteAxios
      .put(`/packages/update/${data._id}`, formData, {
        headers: {
          Authorization: `bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setLoading(false);
        setSnackbar({
          open: true,
          mensaje: res.data,
          status: "success",
        });
        setUpdateQuery(!updateQuery);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
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
      });
  };

  return (
    <div>
      <Button
        size="small"
        color="inherit"
        onClick={() => publicarPackage()}
        disabled={loading}
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <ArchiveIcon />
          )
        }
      >
        {data.archived ? "Restaurar" : "Archivar"}
      </Button>
    </div>
  );
}
