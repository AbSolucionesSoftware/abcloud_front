import React, { useCallback, useContext, useEffect, useState } from "react";
import NotificationsOffIcon from "@material-ui/icons/NotificationsOff";
import { Box, Typography } from "@material-ui/core";
import NotificationListAdmin from "./NotificationListAdmin";
import NewNotificationAdmin from "./NewNotificationAdmin";
import MessageSnackbar from "../../../components/Snackbar/snackbar";
import clienteAxios from "../../../config/axios";
import Spin from "../../../components/Spin/spin";
import {
  NotificationCursoContext,
  NotificationCursoProvider,
} from "../../../context/NotificationCursoCtx";
import CreateNewModal from "./CreateModal/CreateNewModal";

export default function NotificationsAdmin() {
  return (
    <NotificationCursoProvider>
      <NotificationsViewPrincipal />
    </NotificationCursoProvider>
  );
}
const NotificationsViewPrincipal = () => {
  const {
    update,
    notifications,
    setNotifications,
    snackbar,
    setSnackbar,
  } = useContext(NotificationCursoContext);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const getNotificationsAdmin = useCallback(async () => {
    setLoading(true);
    await clienteAxios
      .get(`/notification/get/admin`, {
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
  }, [setNotifications, setSnackbar, token]);

  useEffect(() => {
    getNotificationsAdmin();
  }, [getNotificationsAdmin, update]);

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <CreateNewModal />
        <Box mx={1} />
        <NewNotificationAdmin />
      </Box>
      <Spin loading={loading} />
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />

      {!notifications.length ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          height="20vh"
        >
          <NotificationsOffIcon color="action" style={{ fontSize: 60 }} />
          <Typography>No tienes notificaciones aún.</Typography>
        </Box>
      ) : (
        <NotificationListAdmin notifications={notifications} />
      )}
    </Box>
  );
};
