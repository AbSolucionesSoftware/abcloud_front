import React, { Fragment } from "react";
import { Box, Divider, makeStyles } from "@material-ui/core";
import UnilineDark from "../../../images/unilineDark.png";

const useStyles = makeStyles((theme) => ({
  contentNav: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    // padding: "5px 5px",
    backgroundColor: "rgb(60,0,143)"
  },
  imgLogo: {
    width: "150px",
    margin: "5px"
  },
  contentCount: {
    marginLeft: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
}));

export default function NavQuestion({actiallyQuestion, dataQuestions}) {
  const classes = useStyles();
  return (
    <Fragment>
      <Box className={classes.contentNav}>
        <img className={classes.imgLogo} alt={"logo uniline"} src={UnilineDark} />
        <Divider style={{backgroundColor: "white", margin: "5px 0px"}} orientation="vertical" flexItem />
        <div className={classes.contentCount}>
          <p
            style={{
              margin: "0px",
              fontSize: "17px",
              color: "white",
              fontWeight: "bold"
            }}
          >
            Paso {actiallyQuestion.index + 1} de {dataQuestions.length + 1}
          </p>
        </div>
      </Box>
    </Fragment>
  );
}
