import React from "react";
import { IconButton, InputAdornment, TextField } from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";
import { ConsultaContext } from "../Context";

export default function Hours() {
  const { appointment, setAppointment } = React.useContext(ConsultaContext);

  const handleSum = () => {
    setAppointment((st) => ({ ...st, hours: st.hours + 1 }));
  };
  const handleRemove = () => {
    if(appointment.hours === 1) return
    setAppointment((st) => ({ ...st, hours: st.hours - 1 }));
  };
  
  return (
    <TextField
      type="number"
      fullWidth
      size="small"
      name="hours"
      margin="dense"
      variant="outlined"
      required
      value={appointment.hours}
      inputProps={{ readOnly: true }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">Horas: </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton size="small" color="inherit" onClick={handleRemove}>
              <Remove />
            </IconButton>
            <IconButton size="small" color="secondary" onClick={handleSum}>
              <Add />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
