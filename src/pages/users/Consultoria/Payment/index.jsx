import React from "react";
import InfoConsulta from "./InfoConsulta";
import { Box, Grid } from "@material-ui/core";
import StripePayments from "./StripePayment";
import PaypalPayment from "./PaypalPayment";

export default function Payment() {
  const [typePayment, setTypePayment] = React.useState("");

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <InfoConsulta />
          <Box display="flex" my={2}>
            <StripePayments
              typePayment={typePayment}
              setTypePayment={setTypePayment}
            />
            <Box mx={1} />
            <PaypalPayment
              typePayment={typePayment}
              setTypePayment={setTypePayment}
            />
          </Box>
        </Grid>
        <Grid
          item
          md={6}
          xs={12}
          style={{
            minHeight: "40vh",
          }}
        >
          <StripePayments
            typePayment={typePayment}
            setTypePayment={setTypePayment}
            hideButton={true}
          />
        </Grid>
      </Grid>
    </div>
  );
}
