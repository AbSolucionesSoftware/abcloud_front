import React, { Fragment } from "react";
import { Box, Divider, Typography, makeStyles } from "@material-ui/core";
import ABHorizIcon from "../../../Icons/ABHorizIcon";

const useStyles = makeStyles((theme) => ({
  contentNav: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    // padding: "5px 5px",
    backgroundColor: theme.palette.primary.main,
  },
  imgLogo: {
    width: "150px",
    margin: "5px",
  },
  contentCount: {
    marginLeft: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function NavQuestion({ actiallyQuestion, dataQuestions }) {
  const classes = useStyles();
  return (
    <Fragment>
      <Box className={classes.contentNav}>
        <ABHorizIcon size={9} />
        <Divider
          style={{ backgroundColor: "white", margin: "5px 0px" }}
          orientation="vertical"
          flexItem
        />
        <div className={classes.contentCount}>
          <Typography
            style={{
              margin: "0px",
              fontSize: "17px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Paso {actiallyQuestion.index + 1} de {dataQuestions.length + 1}
          </Typography>
        </div>
      </Box>
    </Fragment>
  );
}
