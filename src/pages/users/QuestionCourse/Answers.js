import React from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  //   FormLabel,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import AdjustIcon from "@material-ui/icons/Adjust";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  formControl: {
    margin: theme.spacing(3),
  },
  checkContent: {
    width: "500px",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    margin: "5px 0px",
    borderRadius: "5px",
    padding: "7px"
  }
}));

export default function Answers({
  answers,
  answersSelected,
  setAnswersSelected,
  textQuestion,
  idCurso,
}) {
  const classes = useStyles();

  return (
    <div>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup>
          {answers?.map((answer,i) => {
            const check = answersSelected.filter((a) => a._id === answer._id);
            return (
              <CheckAnswer
                key={i}
                check={check}
                answersSelected={answersSelected}
                setAnswersSelected={setAnswersSelected}
                answer={answer}
                textQuestion={textQuestion}
                idCurso={idCurso}
                classes={classes}
              />
            );
          })}
        </FormGroup>
      </FormControl>
    </div>
  );
}

function CheckAnswer({
  answer,
  answersSelected,
  setAnswersSelected,
  check,
  textQuestion,
  idCurso,
  classes
}) {
  const theme = useTheme()
  const handleChangeCheck = (ans) => {
    if (check.length > 0) {
      const checkedSelected = answersSelected.filter(
        (asnwerFilter) => asnwerFilter._id !== ans._id
      );
      setAnswersSelected(checkedSelected);
    } else {
      setAnswersSelected([
        ...answersSelected,
        { ...ans, textQuestion, idCurso },
      ]);
    }
  };

  return (
    <FormControlLabel
      style={{
        border: `1px solid rgb(${check.length > 0 ? theme.palette.primary.main : "217,217,217"})`,
      }}
      className={classes.checkContent}
      control={
        <Checkbox
          checked={check.length > 0 ? true : false}
          onChange={() => handleChangeCheck(answer)}
          name="sss"
          icon={
            <AdjustIcon
              style={{ color: "rgb(167,166,170)", fontSize: "25px" }}
            />
          }
          checkedIcon={
            <CheckCircleOutlineIcon
              style={{ color: "rgb(60,0,142)", fontSize: "25px" }}
            />
          }
        />
      }
      label={answer?.answer}
    />
  );
}
