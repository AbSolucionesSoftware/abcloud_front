export const styleQuestions = (theme) => {
  return {
    fatherContent: {
      width: "100%",
      //   height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "50px",
      [theme.breakpoints.down("sm")]: {
        marginTop: "30px",
      },
    },
    content: {
      justifyContent: "center",
      width: "80%",
      [theme.breakpoints.down("md")]: {
        width: "80%",
      },
      [theme.breakpoints.down("sm")]: {
        width: "90%",
      },
      height: "90%",
      //   border: "1px solid",
      marginTop: "auto",
      marginBottom: "auto",
      boxShadow: `-webkit-box-shadow: 0px -1px 5px 0px rgba(0,0,0,1);
      -moz-box-shadow: 0px -1px 5px 0px rgba(0,0,0,1);
      box-shadow: 0px -1px 5px 0px rgba(0,0,0,1);`,
    },
    title: {
      fontSize: "30px",
      // textAlign: "center",
      paddingLeft: "50px",
      fontWeight: "bold",
      marginBottom: "-10px",
      marginTop: "15px",
      color: "rgb(60,0,142)"
    },
    subTitle: {
      fontSize: "20px",
      paddingLeft: "50px",
    },
    contentQuestion: {
      //   border: "1px solid red",
      margin: "20px",
      //   height: "0%",
    },
    questionStyle: {
      fontSize: "18px",
      paddingLeft: "30px",
      marginBottom: "0px",
      marginTop: "50px",
      fontWeight: "bold"
    },
    contentButtonNext: {
      display: "flex",
      justifyContent: "flex-end",
      [theme.breakpoints.down("sm")]: {
        justifyContent: "center",
      },
    },
    buttonNext: {
      backgroundColor: "rgb(60,0,142)",
      [theme.breakpoints.down("sm")]: {
        width: "90%",
        height: "40px",
        fontSize: "17px"
      },
    },
    imgQuestion: {
      width: "400px",
      [theme.breakpoints.down("sm")]: {
        display: "none"
      },
    }
  };
};
