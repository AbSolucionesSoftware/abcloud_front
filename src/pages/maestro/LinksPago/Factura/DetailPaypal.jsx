import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import clienteAxios from "../../../../config/axios";
import { Chip } from "@material-ui/core";

export default function DetailPaypal({ data, setSnackbar }) {
  const [loading, setLoading] = React.useState(false);
  const [paypalData, setPaypalData] = React.useState();
  let token = localStorage.getItem("token");

  React.useEffect(() => {
    const getPaypalData = async () => {
      setLoading(true);
      await clienteAxios
        .get(`/paymentlink/paypal/paymentlink/${data.paymentID}`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
        .then(async (res) => {
          setLoading(false);
          setPaypalData(res.data.response);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setSnackbar({
            open: true,
            mensaje: "Al parecer hubo un error",
            status: "error",
          });
        });
    };
    getPaypalData();
  }, [data.paymentID, setSnackbar, token]);

  if (loading) return <Typography>Cargando datos de paypal...</Typography>;
  if (!paypalData) return null;

  const getColorStatusLink = (status) => {
    switch (status) {
      case "expired":
        return {
          color: "white",
          backgroundColor: "#ff9800",
        };
      case "created":
        return {
          color: "white",
          backgroundColor: "#6fbf73",
        };

      default:
        return null;
    }
  };

  return (
    <div>
      <Box display="flex" alignItems="center">
        <Typography>Status</Typography>
        <Box mx={0.5} />
        <Chip
          label={paypalData.state}
          size="small"
          style={{
            ...getColorStatusLink(paypalData.state),
            fontWeight: "bold",
            height: 20,
          }}
        />
      </Box>
    </div>
  );
}
