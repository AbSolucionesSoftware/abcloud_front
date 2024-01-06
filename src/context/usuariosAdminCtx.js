import React, { createContext, useState } from "react";

export const UsuariosDashCtx = createContext();

export const UsuariosDashProvider = ({ children }) => {
  const [maestros, setMaestros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  return (
    <UsuariosDashCtx.Provider
      value={{
        maestros,
        setMaestros,
        usuarios,
        setUsuarios,
        loading,
        setLoading,
        reload,
        setReload,
        snackbar,
        setSnackbar,
        busqueda,
        setBusqueda,
      }}
    >
      {children}
    </UsuariosDashCtx.Provider>
  );
};
