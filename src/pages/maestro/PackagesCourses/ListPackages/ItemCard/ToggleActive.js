import React from "react";
import Button from "@material-ui/core/Button";
import CloudOff from "@material-ui/icons/CloudOff";
import CloudDone from "@material-ui/icons/CloudDone";
import clienteAxios from "../../../../../config/axios";
import { PackageCtx } from "../../PackagesCtx";
import { CircularProgress } from "@material-ui/core";

export default function ToggleActive({ data }) {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = React.useState(false);
  const { updateQuery, setSnackbar, setUpdateQuery } = React.useContext(
    PackageCtx
  );

  const publicarPackage = async () => {
    const datos = { active: !data.active };
    setLoading(true);
    const formData = new FormData();
    formData.append("active", datos.active);
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
        aria-label="publicar-curso"
        fullWidth
        size="small"
        color={data.active ? "primary" : "default"}
        onClick={() => publicarPackage()}
        disabled={loading}
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : data.active ? (
            <CloudOff />
          ) : (
            <CloudDone />
          )
        }
      >
        {data.active ? "Ocultar" : "Publicar"}
      </Button>
    </div>
  );
}
