import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  useMediaQuery,
  Button,
} from "@material-ui/core";
import { Unarchive } from "@material-ui/icons";
import CardBanner from "./CardBanner";
import clienteAxios from "../../../config/axios";
import Spin from "../../../components/Spin/spin";
import MessageSnackbar from "../../../components/Snackbar/snackbar";
import CrearBanner from "./CrearBanner";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ViewModuleIcon from "@material-ui/icons/ViewModule";

const reorder = (banners, startIndex, endIndex) => {
  const newArray = Array.from(banners);
  const [removed] = newArray.splice(startIndex, 1);
  newArray.splice(endIndex, 0, removed);
  return newArray;
};

export default function BannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [courses, setCourses] = useState([]);
  const [last_banner, setLastBanner] = useState(0);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });
  const matches = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [orden, setOrden] = useState(false);
  const token = localStorage.getItem("token");

  const obtenerBanners = useCallback(async () => {
    setLoading(true);
    await clienteAxios
      .get("/banner/")
      .then((res) => {
        setLoading(false);
        const { banners, courses } = res.data;
        setBanners(banners);
        setCourses(courses);
        if (res.data.length) {
          let lastItem = banners[banners.length - 1].order_number;
          setLastBanner(parseInt(lastItem));
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response) {
          setSnackbar({
            open: true,
            mensaje: err.response.data.message,
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
  }, []);

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const banner_reordenados = reorder(
      banners,
      source.index,
      destination.index
    );
    setOrden(true);
    setBanners(banner_reordenados);
  };

  const guardarOrdenBD = async () => {
    setLoading(true);
    await clienteAxios
      .put("/banner/banner/reorder", banners, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setSnackbar({
          open: true,
          mensaje: res.data.message,
          status: "success",
        });
        setUpdate(!update);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setSnackbar({
            open: true,
            mensaje: err.response.data.message,
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

  useEffect(() => {
    obtenerBanners();
  }, [obtenerBanners, update]);

  return (
    <Box>
      <Spin loading={loading} />
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="text"
          color="primary"
          startIcon={<ViewModuleIcon />}
          disabled={!orden}
          onClick={() => guardarOrdenBD()}
        >
          Guardar orden
        </Button>
        <Box mx={2} />
        <CrearBanner
          update={update}
          setUpdate={setUpdate}
          view="nuevo"
          courses={courses}
          last_banner={last_banner}
          setSnackbar={setSnackbar}
        />
      </Box>
      <Box my={4}>
        {!banners.length ? (
          <Box
            height="40vh"
            flexDirection="column"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Unarchive color="disabled" style={{ fontSize: "100px" }} />
            <Typography variant="h6" color="textSecondary">
              No hay Banners aún
            </Typography>
          </Box>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              direction={matches ? "horizontal" : "vertical"}
              droppableId="droppable-banners"
            >
              {(provided) => (
                <Grid container spacing={2} ref={provided.innerRef}>
                  {banners.map((res, index) => (
                    <CardBanner
                      index={index}
                      key={res._id}
                      banner={res}
                      setUpdate={setUpdate}
                      update={update}
                      courses={courses}
                      setSnackbar={setSnackbar}
                    />
                  ))}
                  {provided.placeholder}
                </Grid>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Box>
    </Box>
  );
}
