import React, { useState, Fragment, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Chip,
  Box,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Typography, IconButton, Avatar } from "@material-ui/core";
import EditarEliminarComentario from "./editar_eliminar";
import LikesAndDislikes from "./likesAndDislikes";
import { DashboardContext } from "../../../../context/dashboar_context";
import { Done } from "@material-ui/icons";
import moment from "moment";
import "moment/locale/es-mx";
import CustomAvatar from "../../../../components/CustomAvatar";

const useStyles = makeStyles((theme) => ({
  respuestas: {
    paddingLeft: theme.spacing(5),
  },
}));

export default function RespuestasComentarios({
  comentario,
  respuesta,
  update,
  setUpdate,
}) {
  const classes = useStyles();
  let user = { _id: "" };
  const token = localStorage.getItem("token");
  const [anchorEl, setAnchorEl] = useState(null);
  const { curso } = useContext(DashboardContext);

  if (token !== null) user = JSON.parse(localStorage.getItem("student"));

  /* menu de respuesta */
  const handleClickMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <Fragment>
      <EditarEliminarComentario
        comentario={comentario}
        anchorEl={anchorEl}
        handleCloseMenu={handleCloseMenu}
        update={update}
        setUpdate={setUpdate}
        commentOrAnswer="answer"
        respuesta={respuesta}
      />
      <Card className={classes.respuestas}>
        <CardHeader
          avatar={
            respuesta.idUser.urlImage ? (
              <Avatar
                aria-label="recipe"
                alt="imagen user"
                src={respuesta.idUser.urlImage}
              />
            ) : (
              <CustomAvatar name={respuesta.idUser.name} />
            )
          }
          action={
            respuesta.idUser._id === user._id ? (
              <IconButton
                aria-label="settings"
                onClick={(e) => handleClickMenu(e)}
              >
                <MoreVertIcon />
              </IconButton>
            ) : null
          }
          title={
            <Box display="flex">
              <Box mr={1}>
                <Typography>{respuesta.idUser.name}</Typography>
              </Box>
              {respuesta.idUser._id === curso.course.idProfessor._id ? (
                <Chip
                  size="small"
                  variant="outlined"
                  icon={<Done />}
                  label="INSTRUCTOR"
                  color="primary"
                />
              ) : null}
            </Box>
          }
          subheader={moment(respuesta.createComment).format("LLL")}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {respuesta.comment}
          </Typography>
        </CardContent>
        <CardActions>
          <LikesAndDislikes
            update={update}
            setUpdate={setUpdate}
            comentario={comentario}
            respuesta={respuesta}
          />
        </CardActions>
      </Card>
    </Fragment>
  );
}
