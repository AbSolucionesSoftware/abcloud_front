import moment from "moment";

export const updateModal = async (modalBase, localModal) => {
  //si hay modalBase..
  if (modalBase.length > 0) {
    //si no hay en localStorage, se ponen en LS
    if (!localModal) {
      const newLS = [{ ...modalBase[0], localS_date: moment() }];
      return newLS;
    } else {
      //Revisar si ya expiro la fecha
      var old_date = localModal[0].localS_date;

      let diffInDays = moment().diff(old_date, "days");
      if (diffInDays > 0) {
        //si hay diferencia volver retornar de nuevo el ls con la fecha actual y visto false
        const newLS = [{ ...modalBase[0], localS_date: moment(), open: false }];
        return newLS;
      } else {
        return [{ ...localModal[0] }];
      }
    }
  } else {
    return null;
  }
};
