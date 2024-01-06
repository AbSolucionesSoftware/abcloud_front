import React, { useCallback, useContext, useEffect, useState } from "react";
import { CursoContext } from "../../../../../context/curso_context";
import NotificationsOffIcon from "@material-ui/icons/NotificationsOff";
import { Box, Typography } from "@material-ui/core";
import NotificationList from "./NotificationList";
import NewNotification from "./NewNotification";
import MessageSnackbar from "../../../../../components/Snackbar/snackbar";
import clienteAxios from "../../../../../config/axios";
import Spin from "../../../../../components/Spin/spin";
import {
  NotificationCursoContext,
  NotificationCursoProvider,
} from "../../../../../context/NotificationCursoCtx";

export default function NotificationsCurso() {
  return (
    <NotificationCursoProvider>
      <NotificationsViewPrincipal />
    </NotificationCursoProvider>
  );
}
const NotificationsViewPrincipal = () => {
  const { datos } = useContext(CursoContext);
  const {
    update,
    notifications,
    setNotifications,
    snackbar,
    setSnackbar,
  } = useContext(NotificationCursoContext);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const idProfessor = datos.length === 0 ? "" : datos.idProfessor._id;

  const getNotificationsTeacher = useCallback(async () => {
    if (!idProfessor || !datos) return;
    setLoading(true);
    await clienteAxios
      .get(`/notification/teacher/${idProfessor}/${datos._id}`,{
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setNotifications(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response) {
          setSnackbar({
            open: true,
            mensaje: err.response.data.message,
            status: "error",
          });
        } else {
          setSnackbar({
            open: true,
            mensaje: "Al parecer no se a podido conectar al servidor.",
            status: "error",
          });
        }
      });
  }, [idProfessor, setNotifications, setSnackbar, token, datos]);

  useEffect(() => {
    getNotificationsTeacher();
  }, [getNotificationsTeacher, update]);

  if (!datos.publication) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        height="20vh"
      >
        <NotificationsOffIcon color="action" style={{ fontSize: 60 }} />
        <Typography>
          No puedes enviar notificaciones si tu curso no está publicado
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <NewNotification course={datos} />
      </Box>
      <Spin loading={loading} />
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <NotificationList notifications={notifications} course={datos} />
    </Box>
  );
};
