import React, { createContext, useState } from "react";

export const NotificationCursoContext = createContext();

export const NotificationCursoProvider = ({ children }) => {
  const [update, setUpdate] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  return (
    <NotificationCursoContext.Provider
      value={{ update, setUpdate, notifications, setNotifications, snackbar, setSnackbar }}
    >
      {children}
    </NotificationCursoContext.Provider>
  );
};
