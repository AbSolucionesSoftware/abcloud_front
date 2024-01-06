import React, { Fragment, useCallback, useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import { updateNotifications } from "./updateLocalStorage";
import NotificationComponent from "./NotificationComponent";
import NotificationResponsive from "./NotificationResponsive";
import { updateModal } from "./updateModal";
import PopupModalPrincipal from "../Navegacion_User/PopupInicial";

export default function Notifications({ responsive }) {
  const token = localStorage.getItem("token");
  const localNotifications = JSON.parse(
    localStorage.getItem("notifications_uniline")
  );
  const localModal = JSON.parse(localStorage.getItem("modal_uniline"));
  const user = JSON.parse(localStorage.getItem("student"));
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);

  const getNotifications = useCallback(async () => {
    if (!user) return;
    setLoaded(true);
    await clienteAxios
      .get(`/notification/${user._id}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then(async (res) => {
        const onlyNotifications = res.data.filter((res) => res.sended);
        const onlyModal = res.data.filter((res) => res.isModal);
        const result = await updateNotifications(
          onlyNotifications,
          localNotifications
        );
        const result_modal = await updateModal(onlyModal, localModal);
        localStorage.setItem("notifications_uniline", JSON.stringify(result));
        localStorage.setItem("modal_uniline", JSON.stringify(result_modal));
        setReady(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, localNotifications, localModal, user]);

  useEffect(() => {
    if (!loaded) getNotifications();
  }, [getNotifications, loaded]);

  return token && ready ? (
    <Fragment>
      {responsive ? <NotificationResponsive /> : <NotificationComponent />}
      <PopupModalPrincipal ready={ready} />
    </Fragment>
  ) : null;
}
