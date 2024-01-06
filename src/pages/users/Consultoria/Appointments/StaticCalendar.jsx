import React from "react";
import { Calendar, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import { ConsultaContext } from "../Context";

export default function StaticCalendar() {
  const { appointment, setAppointment } = React.useContext(ConsultaContext);

  const handleChange = (value) => {
    setAppointment((st) => ({ ...st, fecha: moment(value).format() }));
  };
  return (
    <>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Calendar
          date={appointment.fecha ? moment(appointment.fecha) : moment()}

          onChange={handleChange}
          disablePast
        />
      </MuiPickersUtilsProvider>
    </>
  );
}
