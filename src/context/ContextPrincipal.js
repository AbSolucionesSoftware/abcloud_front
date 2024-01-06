import React, { createContext, useState } from "react";

export const CtxPrincipal = createContext();

export const CtxPrincipalProvider = ({ children }) => {
  const [messaging, setMessaging] = useState(null);
  const [payment, setPayment] = useState(null);

  return (
    <CtxPrincipal.Provider
      value={{ messaging, setMessaging, payment, setPayment }}
    >
      {children}
    </CtxPrincipal.Provider>
  );
};
