import React, { createContext, useState } from "react";

export const TemplateAdminCtx = createContext();

const templateIntialState = {
  show_title: false,
  title: "",
  show_banner: false,
  banner: "",
  banner_key: "",
  show_cards: false,
  data: "",
  category: "",
  courses: [],
  image_on_cards: false,
  image_on_cards_key: "",
  only_cards: "true",
  image_orientation: "",
  url_redirection: "",
};

export const TemplateProvider = ({ children }) => {
  const [update, setUpdate] = useState(false);
  const [previewBanner, setPreviewBanner] = useState("");
  const [previewCardImg, setPreviewCardImg] = useState("");
  const [template, setTemplate] = useState(templateIntialState);
  const [cursos, setCursos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [templatesList, setTemplatesList] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });

  return (
    <TemplateAdminCtx.Provider
      value={{
        update,
        setUpdate,
        template,
        setTemplate,
        snackbar,
        setSnackbar,
        previewBanner,
        setPreviewBanner,
        previewCardImg,
        setPreviewCardImg,
        cursos,
        setCursos,
        categorias,
        setCategorias,
        templatesList,
        setTemplatesList,
      }}
    >
      {children}
    </TemplateAdminCtx.Provider>
  );
};
