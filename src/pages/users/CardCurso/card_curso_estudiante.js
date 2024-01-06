import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";
import CardActionArea from "@material-ui/core/CardActionArea";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import { CardActions, Typography } from "@material-ui/core";
import { withRouter } from "react-router-dom";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 2,
    backgroundColor: theme.palette.primary.main,
  },
}))(LinearProgress);

const useStyles = makeStyles((theme) => ({
  root: {
    /* cursor: "pointer", */
    width: "100%",
    height: "100%"
    /* margin: '8px 16px!important' */
    /* [theme.breakpoints.only("sm")]: {
      width: 220,
    }, */
    /* [theme.breakpoints.down("xs")]: {
      width: 160,
    }, */
  },
  actionArea: {
    "&:hover .content-play": {
      display: "flex",
      opacity: 0.6,
      "& .button-play": {
        display: "block",
      },
    },
  },
  playContent: {
    position: "absolute",
    /* display: "none", */
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    opacity: 0,
    transitionDuration: "0.15s",
    transitionTimingFunction: "linear",
    "& .button-play": {
      display: "none",
    },
  },
  media: {
    height: 170,
    /* paddingTop: '56.25%' // 16:9, */
    /* [theme.breakpoints.down("xs")]: {
      height: 100,
    }, */
  },
  title: {
    display: "-webkit-box",
    overflow: "hidden",
    position: "relative",
    textOverflow: "ellipsis",
    "-webkit-line-clamp": 3,
    "-webkit-box-orient": "vertical",
    fontSize: 18,
    fontWeight: 400,
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
    },
  },
  cardContent: {
    padding: theme.spacing(1),
  },
}));

function CardsCursosEstudiantes(props) {
  const { curso } = props;
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea
        className={classes.actionArea}
        onClick={() => props.history.push(`/dashboard/${curso.idCourse.slug}`)}
      >
        <Box className={classes.playContent + " content-play"}>
          <PlayCircleFilledIcon
            className="button-play"
            style={{ fontSize: 72, color: "white" }}
          />
        </Box>
        <CardMedia
          className={classes.media + " content-media"}
          image={curso.idCourse.urlPromotionalImage}
        />
      </CardActionArea>

      <CardContent className={classes.cardContent}>
        <Typography color="textPrimary" className={classes.title}>
          {curso.idCourse.title}
        </Typography>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          noWrap
          style={{ width: "100%" }}
        >
          {curso.idCourse.category}
        </Typography>
      </CardContent>
      <CardActions>
      <Box width="100%" >
        <BorderLinearProgress
          variant="determinate"
          value={parseInt(curso.studentAdvance)}
        />
        <Typography>Avance del curso: {curso.studentAdvance}%</Typography>
      </Box>
			</CardActions>
      {/* <CardActions className={classes.cardContent}>
				<Button
					variant="text"
					color="primary"
					fullWidth
					component={Link}
					to={`/dashboard/${curso.idCourse.slug}`}
				>
					¡Continuar con tus clases!
				</Button>
			</CardActions> */}
    </Card>
  );
}
export default withRouter(CardsCursosEstudiantes);
