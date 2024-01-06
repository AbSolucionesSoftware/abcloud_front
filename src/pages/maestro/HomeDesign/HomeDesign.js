import React, { useCallback, useContext, useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CrearTemplate from "./CreatTemplate/CrearTemplate";
import { ViewModule } from "@material-ui/icons";
import {
  TemplateAdminCtx,
  TemplateProvider,
} from "../../../context/makingTemplateAdmin";
import clienteAxios from "../../../config/axios";
import MessageSnackbar from "../../../components/Snackbar/snackbar";

function HomeDesign() {
  return (
    <div>
      <TemplateProvider>
        <HomeDesignerContent />
      </TemplateProvider>
    </div>
  );
}

const HomeDesignerContent = () => {
  const {
    setCategorias,
    setCursos,
    setTemplatesList,
    setSnackbar,
    snackbar,
  } = useContext(TemplateAdminCtx);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const obtenerTemplates = useCallback(async () => {
    await clienteAxios
      .get("/templates/admin", {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setTemplatesList(res.data.templates);
        setCursos(res.data.courses);
        setCategorias(res.data.categories);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.message) {
          setSnackbar({ open: true, message: err.message, status: "error" });
          return;
        }
        setSnackbar({
          open: true,
          message: "Ocurrio un error",
          status: "error",
        });
      });
  }, [setCategorias, setCursos, setTemplatesList, setSnackbar, token]);
  
  useEffect(() => {
    obtenerTemplates();
  }, [obtenerTemplates]);

  return (
    <Box>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Box display="flex" justifyContent="flex-end">
        <Button color="primary" variant="text" startIcon={<ViewModule />}>
          Guardar orden
        </Button>
        <Box mx={1} />
        <CrearTemplate />
      </Box>
      <Box>{loading ? "Cargando" : "LISTA"}</Box>
    </Box>
  );
};

export default HomeDesign;
