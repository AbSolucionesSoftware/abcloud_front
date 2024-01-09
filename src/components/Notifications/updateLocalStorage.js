const diferenciaDeArreglos = (arr1, arr2) => {
  return arr1.filter((elemento) => arr2.indexOf(elemento) === -1);
};

export const updateNotifications = async (
  notificaciones,
  localNotifications
) => {
  //si hay notificaciones..
  if (notificaciones.length > 0) {
    //si no hay en localStorage, se ponen en LS
    if (!localNotifications) {
      return notificaciones;
      /* localStorage.setItem("notifications_abcloud", JSON.stringify(notificaciones)); */
    } else {
      //si hay, entonces compara las notificaciones existentes
      //sacar solo ids de ambos para comparar arrays
      const ids_nuevos = notificaciones.map((res) => res._id);
      const ids_local = localNotifications.map((res) => res._id);
      //aplicando una funcion sacamos notificaciones eliminadas y nuevas
      const eliminadas = await diferenciaDeArreglos(ids_local, ids_nuevos);
      const nuevas = await diferenciaDeArreglos(ids_nuevos, ids_local);

      //declarar nueva variable para actualizar localStorage
      let localWihtoutDeleted = [...localNotifications];
      let onlyNews = [];

      if (eliminadas.length > 0) {
        localWihtoutDeleted = localNotifications.filter(
          (exist) => eliminadas.indexOf(exist._id) === -1
        );
      }
      if (nuevas.length > 0) {
        onlyNews = notificaciones.filter(
          (noti) => nuevas.indexOf(noti._id) !== -1
        );
      }
      return [...localWihtoutDeleted, ...onlyNews];
    }
  }
  return [];
};
