import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Appoinments from "./Appointments";
import { Box, Container } from "@material-ui/core";
import Payment from "./Payment";
import { ConsultaContext, ConsultaProvider } from "./Context";
import PaymentSuccess from "./Payment/PaymentSuccess";
import PaymentError from "./Payment/PaymentError";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    minHeight: "90vh",
  },
  button: {
    marginRight: theme.spacing(2),
  },
  actionsContainer: {
    display: "flex",
    justifyContent: "center",
  },
}));

function getSteps() {
  return ["Qué necesitas", "Confirmar y pagar"];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <Appoinments />;
    case 1:
      return <Payment />;
    default:
      return "Unknown step";
  }
}

function RenderConsultoria() {
  const classes = useStyles();
  const { activeStep, handleBack } = React.useContext(ConsultaContext);
  const steps = getSteps();

  return (
    <Container className={classes.container}>
      <Container maxWidth="md">
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      </Container>
      {activeStep === steps.length ? (
        <Paper
          square
          elevation={0}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <PaymentSuccess />
          <PaymentError />
        </Paper>
      ) : (
        <Box>
          <Box minHeight="65vh">{getStepContent(activeStep)}</Box>
          <div className={classes.actionsContainer}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              className={classes.button}
              size="small"
            >
              Regresar
            </Button>
            {activeStep === steps.length - 1 ? null : (
              <Button
                variant="contained"
                color="secondary"
                disableElevation
                size="small"
                type="submit"
                form="appointment-form"
                className={classes.button}
              >
                Confirmar
              </Button>
            )}
          </div>
        </Box>
      )}
    </Container>
  );
}

export default function Consultoria() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ConsultaProvider>
      <RenderConsultoria />
    </ConsultaProvider>
  );
}
