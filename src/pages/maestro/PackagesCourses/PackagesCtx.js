import React, { createContext } from "react";

export const PackageCtx = createContext();

export const PackagesProvider = ({ children }) => {
  const [updateQuery, setUpdateQuery] = React.useState(false);
  const [packagesArchived, setPackagesArchived] = React.useState([]);
  const [packageObj, setPackage] = React.useState({
    title: "",
    slug: "",
    description: "",
    image: "",
    key_image: "",
    courses: [],
    active: true,
    pricePack: 0,
  });
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    mensaje: "",
    status: "",
  });
  const [preview, setPreview] = React.useState("");

  return (
    <PackageCtx.Provider
      value={{
        updateQuery,
        setUpdateQuery,
        snackbar,
        setSnackbar,
        packageObj,
        setPackage,
        packagesArchived,
        setPackagesArchived,
        preview, setPreview
      }}
    >
      {children}
    </PackageCtx.Provider>
  );
};
