import React from "react";
import moment from "moment";
import "moment-timezone";
moment.tz.setDefault("America/Mexico_City");

export const ConsultaContext = React.createContext();

const initState = {
  start: "",
  end: "",
  fecha: moment().format(),
  hora: 0,
  minuto: 0,
  hours: 1,
  product: "",
  idProduct: "",
  summary: "",
  description: "",
  amount: "",
  baseAmount: 0,
  name: "",
  email: "",
};

export const ConsultaProvider = ({ children }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [appointment, setAppointment] = React.useState(initState);
  const [fechaErr, setFechaErr] = React.useState("");
  const [paymentStatus, setPaymentStatus] = React.useState({
    status: "",
    data: null,
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fecha, hora, minuto, hours, baseAmount } = appointment;
    if (!baseAmount || !hours) return;
    if (!fecha || !hora) {
      setFechaErr("Selecciona fecha y hora");
      return;
    }
    const start = moment(fecha).hour(hora).minute(minuto).format();
    const end = moment(start).add(hours, "hours").format();
    setAppointment((st) => ({
      ...st,
      start,
      end,
      amount: baseAmount * hours,
    }));
    setFechaErr("");
    handleNext();
  };

  return (
    <ConsultaContext.Provider
      value={{
        activeStep,
        setActiveStep,
        appointment,
        setAppointment,
        handleNext,
        handleBack,
        handleSubmit,
        paymentStatus,
        setPaymentStatus,
        fechaErr,
      }}
    >
      {children}
    </ConsultaContext.Provider>
  );
};
