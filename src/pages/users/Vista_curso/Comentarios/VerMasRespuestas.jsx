import React from "react";
import { Box, Typography, Button, CircularProgress } from "@material-ui/core";
import "moment/locale/es-mx";
import { SmsOutlined } from "@material-ui/icons";
import clienteAxios from "../../../../config/axios";
import { ComentariosCursoCtx } from "../../../../context/comentariosCursoCtx";

export default function VerMasRespuestas({ comentario }) {
  const { reply, setReply } = React.useContext(ComentariosCursoCtx);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const getMoreReplys = async () => {
    setLoading(true);
    await clienteAxios
      .get(
        `/comment/answerQualification/get/${comentario._id}?page=${reply.nextPage}&limit=4`
      )
      .then((res) => {
        let data = [...reply.data, ...res.data.docs];
        setLoading(false);
        setReply((reply) => ({
          ...reply,
          loading: false,
          data,
          hasNextPage: res.data.hasNextPage,
          nextPage: res.data.nextPage,
          page: res.data.page,
          totalDocs: res.data.totalDocs,
        }));
      })
      .catch((err) => {
        setLoading(false);
        if (err.response?.data.message) {
          setError(err.response.data.message);
        } else if (err.message) {
          setError(err.message);
        } else {
          setError("No se pudo establecer conexión con el servidor");
        }
      });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={1}>
        <Button
          startIcon={<CircularProgress size={20} color="inherit" />}
          size="small"
          disableFocusRipple
          disableRipple
        >
          Cargando más respuestas...
        </Button>
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
    <Box display="flex" justifyContent="center" my={1}>
      {reply.hasNextPage ? (
        <Button
          startIcon={<SmsOutlined />}
          size="small"
          onClick={() => getMoreReplys()}
        >
          Ver más respuestas
        </Button>
      ) : null}
    </Box>
  );
}
