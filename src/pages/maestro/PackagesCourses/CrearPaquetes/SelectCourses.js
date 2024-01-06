import React, { useCallback, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Add } from "@material-ui/icons";
import clienteAxios from "../../../../config/axios";
import MessageSnackbar from "../../../../components/Snackbar/snackbar";
import { PackageCtx } from "../PackagesCtx";

export default function SelectCourses() {
  const token = localStorage.getItem("token");
  const [open, setOpen] = React.useState(false);
  const {packageObj, setPackage } = React.useContext(PackageCtx);
  const [loading, setLoading] = React.useState(false);
  const [cursos, setCursos] = React.useState([]);
  const [courseSelected, setCourseSelected] = React.useState({
    title: "Selecciona uno",
    course: null,
  });
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    mensaje: "",
    status: "",
  });
  let user = { _id: "" };

  if (token !== null) user = JSON.parse(localStorage.getItem("student"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCourseSelected({
      title: "Selecciona uno",
      course: null,
    });
  };

  const obtenerCursosBD = useCallback(async () => {
    setLoading(true);
    await clienteAxios
      .get(`/course/teacher/${user._id}?public=true`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setCursos(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setSnackbar({
          open: true,
          mensaje: "Hubo un error al obtener los cursos",
          status: "error",
        });
      });
  }, [token, user._id]);

  useEffect(() => {
    obtenerCursosBD();
  }, [obtenerCursosBD]);

  const handleChangeSelect = (_, childEvent) => {
    const { value, curso } = childEvent.props;
    setCourseSelected({ title: value, course: curso });
  };

  const selectCourse = () => {
    setPackage({
      ...packageObj,
      courses: [
        ...packageObj.courses,
        {
          course: courseSelected.course,
          courseId: courseSelected.course._id,
          prices: {
            free: false,
            price: courseSelected.course.priceCourse.price,
            promotionPrice: courseSelected.course.priceCourse.price,
            persentagePromotion: "0",
          },
        },
      ],
      pricePack: packageObj.pricePack + courseSelected.course.priceCourse.price,
    });
    handleClose();
  };

  return (
    <div>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Button
        startIcon={
          loading ? <CircularProgress size={20} color="inherit" /> : <Add />
        }
        disabled={loading}
        variant="text"
        color="primary"
        onClick={handleClickOpen}
      >
        Agregar curso
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogContent>
          <FormControl variant="outlined" size="small" fullWidth>
            <Select value={courseSelected.title} onChange={handleChangeSelect}>
              <MenuItem value="Selecciona uno">
                <em>Selecciona uno</em>
              </MenuItem>
              {cursos.map((res, index) => (
                <MenuItem
                  key={index}
                  value={res.course.title}
                  curso={res.course}
                >
                  {res.course.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={selectCourse}
            color="primary"
            disabled={!courseSelected.course}
          >
            Seleccionar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
