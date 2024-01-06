import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ConfirmarPago from "./ConfirmarPago";
import { Box, Button, Container } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStripe } from "@fortawesome/free-brands-svg-icons";
import PaymentError from "../PaymentError";
import { ConsultaContext } from "../../Context";

export default function StripePayment({
  typePayment,
  setTypePayment,
  hideButton,
}) {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_LLAVE);
  //const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_LLAVE_TEST);
  const { paymentStatus } = React.useContext(ConsultaContext);

  return (
    <Box height="100%">
      <div hidden={typePayment === "stripe" || hideButton}>
        <Button
          onClick={() => setTypePayment("stripe")}
          style={{
            padding: 0,
          }}
          variant={typePayment !== "stripe" ? "text" : "contained"}
          disableElevation
        >
          <FontAwesomeIcon
            icon={faStripe}
            style={{
              fontSize: "35px",
              width: "100px",
              backgroundColor: "#5433FF",
              color: "white",
              borderRadius: 5,
            }}
          />
        </Button>
      </div>
      <Box hidden={typePayment !== "stripe" || !hideButton} style={{ borderLeft: "1px solid #eee", height: "100%"}}>
        <Container
          maxWidth="xs"
          style={{
            minHeight: "40vh",
          }}
        >
          <Box style={{ padding: 16, height: "100%" }}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mb={2}
            >
              <FontAwesomeIcon
                icon={faStripe}
                style={{
                  fontSize: "80px",
                  width: "100px",
                  color: "#5433FF",
                }}
              />
            </Box>
            {paymentStatus.status ? (
              <PaymentError setTypePayment={setTypePayment} />
            ) : (
              <Elements stripe={stripePromise}>
                <ConfirmarPago setTypePayment={setTypePayment} />
              </Elements>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
