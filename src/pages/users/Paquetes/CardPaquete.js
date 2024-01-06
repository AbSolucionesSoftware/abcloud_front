import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import { formatoMexico } from "../../../config/reuserFunction";
import { withRouter } from "react-router-dom";
import { Fragment } from "react";
import { CardActionArea, CardActions, CardMedia } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    cursor: "pointer",
    width: "100%",
    height: "100%",
  },
  avatar: {
    backgroundColor: red[500],
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
  descripcion: {
    display: "-webkit-box",
    overflow: "hidden",
    position: "relative",
    textOverflow: "ellipsis",
    "-webkit-line-clamp": 3,
    "-webkit-box-orient": "vertical",
    fontSize: 14,
    "& > p": {
      margin: 0,
    },
  },
  avatarGroup: {
    display: "flex",
    justifyContent: "center",
  },
  avatarCourse: {
    height: 120,
    width: 120,
  },
  container: {
    height: 170,
  },
  avatarContainer: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  pack: {
    position: "absolute",
    backgroundColor: theme.palette.error.light,
    color: "white",
    top: 5,
    left: 5,
    padding: "2px 8px",
    borderRadius: "5px",
    fontWeight: 600,
  },
}));

function CardPaquete(props) {
  const classes = useStyles();
  const { paquete } = props;

  return (
    <Fragment>
      <Card
        className={classes.root}
        onClick={() => props.history.push(`/paquete/${paquete.slug}`)}
      >
        <CardActionArea>
          {/* <Hidden xsDown>
            <CardHeader
              avatar={
                paquete.idProfessor.urlImage ? (
                  <Avatar
                    aria-label="recipe"
                    className={classes.avatar}
                    src={paquete.idProfessor.urlImage}
                  />
                ) : (
                  <Avatar aria-label="recipe" className={classes.avatar}>
                    {paquete.idProfessor.name.charAt(0)}
                  </Avatar>
                )
              }
              title={paquete.idProfessor.name}
              subheader={`Creado el ${formatoFechaCurso(paquete.createdAt)}`}
            />
          </Hidden> */}
          <Box className={classes.container}>
            <Box className={classes.pack}>Pack de cursos</Box>
            {paquete.image ? (
              <CardMedia style={{ height: "100%" }} image={paquete.image} />
            ) : (
              <Box className={classes.avatarContainer}>
                <AvatarGroup max={4} className={classes.avatarGroup}>
                  {paquete.courses.map((res, index) => (
                    <Avatar
                      key={index}
                      className={classes.avatarCourse}
                      alt={` curso ${index}`}
                      src={res.course?.urlPromotionalImage}
                    />
                  ))}
                </AvatarGroup>
              </Box>
            )}
          </Box>
          <CardContent>
            <Typography gutterBottom component="h2" className={classes.title}>
              {paquete.title}
            </Typography>
            <Typography color="textSecondary" variant="caption">
              Creado por {paquete.idProfessor.name}
            </Typography>
            <Typography className={classes.descripcion} color="textSecondary">
              {paquete.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Typography style={{ fontSize: 18 }}>
              ${formatoMexico(paquete.pricePack)} MXN
            </Typography>
          </CardActions>
        </CardActionArea>
      </Card>
    </Fragment>
  );
}

export default withRouter(CardPaquete);
