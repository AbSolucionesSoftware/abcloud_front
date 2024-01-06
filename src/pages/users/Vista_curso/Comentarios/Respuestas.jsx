import React, { Fragment } from "react";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
  Typography,
  Collapse,
} from "@material-ui/core";
import moment from "moment";
import "moment/locale/es-mx";
import { CheckCircle } from "@material-ui/icons";
import Reactions from "./Reactions";
import Responder from "./Responder";
import clienteAxios from "../../../../config/axios";
import { TransitionGroup } from "react-transition-group";
import EditarRespuesta from "./EditarRespuesta";
import { ComentariosCursoCtx } from "../../../../context/comentariosCursoCtx";
import EliminarRespuesta from "./EliminarRespuesta";
import VerMasRespuestas from "./VerMasRespuestas";
import CustomAvatar from "../../../../components/CustomAvatar";

const useStyles = makeStyles((theme) => ({
  avatar: {
    //backgroundColor: red[500],
    height: 30,
    width: 30,
    fontSize: 16,
  },
  respuestas: {
    padding: 0,
    margin: "3px 0px 0px 32px",
    backgroundColor: theme.palette.background.default,
    border: 0,
    [theme.breakpoints.down("xs")]: {
      margin: "3px 0px 0px",
    }
  },
}));

export default function Respuestas({ comentario, curso }) {
  return (
    <Fragment>
      <Divider />
      <Responder comentario={comentario} curso={curso} />
      <ListaRespuestas comentario={comentario} curso={curso} />
    </Fragment>
  );
}

const ListaRespuestas = ({ comentario, curso }) => {
  const { reply, setReply } = React.useContext(ComentariosCursoCtx);
  const { data, loading, error } = reply;

  React.useLayoutEffect(() => {
    const getReplys = async () => {
      await clienteAxios
        .get(
          `/comment/answerQualification/get/${comentario._id}?page=1&limit=4`
        )
        .then((res) => {
          setReply((reply) => ({
            ...reply,
            loading: false,
            data: res.data.docs,
            hasNextPage: res.data.hasNextPage,
            nextPage: res.data.nextPage,
            page: res.data.page,
            totalDocs: res.data.totalDocs,
          }));
        })
        .catch((err) => {
          if (err.response?.data.message) {
            setReply((reply) => ({
              ...reply,
              loading: false,
              error: err.response.data.message,
            }));
          } else if (err.message) {
            setReply((reply) => ({
              ...reply,
              loading: false,
              error: err.message,
            }));
          } else {
            setReply((reply) => ({
              ...reply,
              loading: false,
              error: "No se pudo establecer conexión con el servidor",
            }));
          }
        });
    };
    getReplys();
  }, [comentario._id, setReply]);

  if (loading) {
    return (
      <Box my={1}>
        <Typography align="center">Cargando comentarios...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={1}>
        <Typography align="center">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TransitionGroup>
        {data.map((res, index) => (
          <Collapse key={`${index}-card-${res._id}`}>
            <CardContentComponent
              //key={`${index}-card`}
              data={res}
              curso={curso}
              index={index}
            />
          </Collapse>
        ))}
      </TransitionGroup>
      <VerMasRespuestas comentario={comentario} />
    </Box>
  );
};

const CardContentComponent = ({ data, curso, index }) => {
  const classes = useStyles();
  return (
    <Box>
      <Card
        className={classes.respuestas}
        variant="outlined"
      >
        <CardHeader
          key={`carhead-${data._id}`}
          avatar={
            data.idUser.urlImage ? (
              <Avatar
                aria-label="recipe"
                alt="imagen user"
                style={{ height: 50, width: 50 }}
                src={data.idUser.urlImage}
              />
            ) : (
              <CustomAvatar size={34} name={data.idUser.name} />
            )
          }
          title={
            <Box display="flex">
              <Box mr={1}>
                <Typography>{data.idUser.name}</Typography>
              </Box>
              {data.idUser._id === curso.course.idProfessor._id ? (
                <CheckCircle style={{ fontSize: 20 }} color="primary" />
              ) : null}
            </Box>
          }
          subheader={moment(data.createdAt).format("LLL")}
          style={{ padding: "3px 0 0 16px" }}
          action={[
            <EditarRespuesta data={data} index={index} />,
            <EliminarRespuesta data={data} index={index} />,
          ]}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {data.answer}
          </Typography>
        </CardContent>
        <CardActions style={{ justifyContent: "flex-end", padding: 3 }}>
          <Reactions comentario={data} curso={curso} />
        </CardActions>
        <Divider />
      </Card>
    </Box>
  );
};
