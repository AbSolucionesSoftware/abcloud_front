import { Box, Chip, makeStyles } from "@material-ui/core";
import {
  Favorite,
  FavoriteBorder,
  ThumbDown,
  ThumbDownOutlined,
  ThumbUp,
  ThumbUpAltOutlined,
} from "@material-ui/icons";
import React, { useState } from "react";
import MessageSnackbar from "../../../../components/Snackbar/snackbar";
import jwt_decode from "jwt-decode";
import { NavContext } from "../../../../context/context_nav";
import clienteAxios from "../../../../config/axios";

const useStyles = makeStyles((theme) => ({
  colorLoveit: {
    color: "red",
  },
  colorLikes: {
    color: theme.palette.primary.main,
  },
}));

function Reactions({ curso, comentario }) {
  const token = localStorage.getItem("token");
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });
  const [reactions, setReactions] = useState({
    data: undefined,
    error: undefined,
    loading: true,
    userReaction: null,
  });
  const { misCursos } = React.useContext(NavContext);

  const usuario = token ? jwt_decode(token) : {_id: "null"};
  let course = false;
  if (misCursos) {
    misCursos.forEach((res) => {
      if (res.idCourse._id === curso.course._id) {
        course = true;
      }
    });
  }

  const handleReaction = async (reaction) => {
    if(!token || !usuario || !course) return
    await clienteAxios
      .post(
        `/comment/reaction/create/${curso.course._id}/${usuario._id}/${comentario._id}`,
        { reaction },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setReactions((prev) => ({
          ...prev,
          loading: false,
          data: res.data.reactions,
          userReaction: res.data.user_reaction,
        }));
      })
      .catch((err) => {
        if (err.response) {
          setSnackbar({
            open: true,
            mensaje: err.response.data.message
              ? err.response.data.message
              : err.message,
            status: "error",
          });
        } else {
          setSnackbar({
            open: true,
            mensaje: "Al parecer no se a podido conectar al servidor.",
            status: "error",
          });
        }
      });
  };

  return (
    <Box>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <RenderReactionIcons
        handleReaction={handleReaction}
        comentario={comentario}
        usuario={usuario}
        reactions={reactions}
        setReactions={setReactions}
        course={course}
      />
    </Box>
  );
}

const RenderReactionIcons = ({
  handleReaction,
  comentario,
  usuario,
  reactions,
  setReactions,
  course
}) => {
  const classes = useStyles();
  const token = localStorage.getItem("token");

  React.useEffect(() => {
    const getReactions = async () => {
      await clienteAxios
        .get(`/comment/reaction/get/${comentario._id}/${usuario._id}`)
        .then((res) => {
          setReactions((prev) => ({
            ...prev,
            loading: false,
            data: res.data.reactions,
            userReaction: res.data.user_reaction,
          }));
        })
        .catch((err) => {
          if (err.response?.data.message) {
            setReactions((prev) => ({
              ...prev,
              loading: false,
              error: err.response.data.message
                ? err.response.data.message
                : err.message,
            }));
          } else {
            setReactions((prev) => ({
              ...prev,
              loading: false,
              error: "No se pudo establecer conexión con el servidor",
            }));
          }
        });
    };
    getReactions();
  }, [comentario._id, setReactions, usuario._id]);

  const { data, error, loading, userReaction } = reactions;

  if (loading || error) return <RenderReactionIconsEmpty />;

  return (
    <Box display="flex">
      <Chip
        icon={userReaction === "LOVEIT" ? <Favorite /> : <FavoriteBorder />}
        classes={
          userReaction === "LOVEIT" ? { icon: classes.colorLoveit } : null
        }
        label={!data.length ? 0 : data[0].loveit}
        clickable={!token || !usuario || !course ? false : true}
        variant="outlined"
        size="small"
        onClick={() => handleReaction("LOVEIT")}
      />
      <Box mx={0.3} />
      <Chip
        icon={userReaction === "LIKE" ? <ThumbUp /> : <ThumbUpAltOutlined />}
        label={!data.length ? 0 : data[0].like}
        clickable={!token || !usuario || !course ? false : true}
        classes={userReaction === "LIKE" ? { icon: classes.colorLikes } : null}
        variant="outlined"
        size="small"
        onClick={() => handleReaction("LIKE")}
      />
      <Box mx={0.3} />
      <Chip
        icon={
          userReaction === "DISLIKE" ? <ThumbDown /> : <ThumbDownOutlined />
        }
        label={!data.length ? 0 : data[0].dislike}
        clickable={!token || !usuario || !course ? false : true}
        classes={
          userReaction === "DISLIKE" ? { icon: classes.colorLikes } : null
        }
        variant="outlined"
        size="small"
        onClick={() => handleReaction("DISLIKE")}
      />
    </Box>
  );
};

const RenderReactionIconsEmpty = () => {
  return (
    <Box display="flex">
      <Chip
        icon={<FavoriteBorder />}
        label="0"
        variant="outlined"
        size="small"
      />
      <Box mx={0.3} />
      <Chip
        icon={<ThumbUpAltOutlined />}
        label="0"
        variant="outlined"
        size="small"
      />
      <Box mx={0.3} />
      <Chip
        icon={<ThumbDownOutlined />}
        label="0"
        variant="outlined"
        size="small"
      />
      <Box mx={0.3} />
    </Box>
  );
};

export default Reactions;
