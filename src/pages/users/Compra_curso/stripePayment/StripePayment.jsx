import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ConfirmarPago from "./ConfirmarPago";

export default function StripePayment({ compra, total }) {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_LLAVE);
  //const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_LLAVE_TEST);
  return (
    <Elements stripe={stripePromise}>
      <ConfirmarPago compra={compra} total={total} />
    </Elements>
  );
}

