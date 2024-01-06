import React, { Fragment } from "react";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Hidden,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import moment from "moment";
import "moment/locale/es-mx";
import { CheckCircle, Star } from "@material-ui/icons";
import Reactions from "./Reactions";
import Respuestas from "./Respuestas";
import {
  ComentariosCursoCtx,
  ComentariosCursoProvider,
} from "../../../../context/comentariosCursoCtx";
import CustomAvatar from "../../../../components/CustomAvatar";

const useStyles = makeStyles((theme) => ({
  respuestas: {
    marginTop: theme.spacing(2),
    border: 0,
  },
}));

export default function ListaComentarios({ comentario, curso }) {
  const classes = useStyles();

  return (
    <Fragment>
      <ComentariosCursoProvider>
        <Card className={classes.respuestas} variant="outlined">
          <CardHeader
            style={{ padding: "8px 8px 0 8px" }}
            avatar={
              comentario.idUser.urlImage ? (
                <Avatar
                  aria-label="recipe"
                  alt="imagen user"
                  src={comentario.idUser.urlImage}
                />
              ) : (
                <CustomAvatar name={comentario.idUser.name} />
              )
            }
            title={
              <Box display="flex">
                <Box mr={1}>
                  <Typography>{comentario.idUser.name}</Typography>
                </Box>
                {comentario.idUser._id === curso.course.idProfessor._id ? (
                  <CheckCircle color="primary" />
                ) : null}
              </Box>
            }
            subheader={moment(comentario.createdAt).format("LLL")}
            action={
              <>
                <Hidden xsDown>
                  <Rating
                    name="read-only"
                    value={comentario.qualification}
                    readOnly
                    precision={0.5}
                    size="small"
                  />
                </Hidden>
                <Hidden smUp>
                  <Box display="flex">
                    <Star htmlColor="#FFE400" />
                    <Box ml={1}>
                      <Typography variant="subtitle1">
                        <b>{comentario.qualification}</b>
                      </Typography>
                    </Box>
                  </Box>
                </Hidden>
              </>
            }
          />

          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {comentario.comment}
            </Typography>
          </CardContent>
          <CardActions style={{ justifyContent: "space-between", padding: 3 }}>
            <ItemsActions comentario={comentario} curso={curso} />
          </CardActions>
          <Respuestas comentario={comentario} curso={curso} />
        </Card>
      </ComentariosCursoProvider>
    </Fragment>
  );
}

const ItemsActions = ({ curso, comentario }) => {
  const { reply } = React.useContext(ComentariosCursoCtx);
  return (
    <>
      <Typography variant="button"> {reply.totalDocs} respuestas</Typography>
      <Reactions curso={curso} comentario={comentario} />
    </>
  );
};
