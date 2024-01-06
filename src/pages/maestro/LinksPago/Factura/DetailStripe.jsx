import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import clienteAxios from "../../../../config/axios";
import { Chip } from "@material-ui/core";

export default function DetailStripe({ data, setSnackbar }) {
  const [loading, setLoading] = React.useState(false);
  const [stripeData, setStripeData] = React.useState();
  let token = localStorage.getItem("token");

  React.useEffect(() => {
    const getStripeData = async () => {
      setLoading(true);
      await clienteAxios
        .get(`/paymentlink/stripe/paymentlink/${data.paymentID}`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
        .then(async (res) => {
          setLoading(false);
          setStripeData(res.data.response);
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
    getStripeData();
  }, [data.paymentID, setSnackbar, token]);

  if (loading) return <Typography>Cargando datos de stripe...</Typography>;
  if (!stripeData) return null;

  const getColorStatusLink = (status) => {
    switch (status) {
      case "expired":
        return {
          color: "white",
          backgroundColor: "#ff9800",
        };
      case "open":
        return {
          color: "white",
          backgroundColor: "#2196f3",
        };
      case "complete":
        return {
          color: "white",
          backgroundColor: "#6fbf73",
        };

      default:
        return null;
    }
  };

  const getColorStatusPay = (status) => {
    switch (status) {
      case "paid":
        return {
          color: "white",
          backgroundColor: "#6fbf73",
        };
      case "unpaid":
        return null;

      default:
        return null;
    }
  };

  return (
    <Box display="flex" alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography>
          Pago:
        </Typography>
        <Box mx={0.5} />
        <Chip
          label={stripeData.payment_status}
          size="small"
          style={{
            ...getColorStatusPay(stripeData.payment_status),
            fontWeight: "bold",
            height: 20
          }}
        />
      </Box>
      <Box mx={1.5} />
      <Box display="flex" alignItems="center">
        <Typography>
          Link:
        </Typography>
        <Box mx={0.5} />
        <Chip
          label={stripeData.status}
          size="small"
          style={{
            ...getColorStatusLink(stripeData.status),
            fontWeight: "bold",
            height: 20
          }}
        />
      </Box>
    </Box>
  );
}