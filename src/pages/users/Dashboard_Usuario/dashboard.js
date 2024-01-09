import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Hidden,
  IconButton,
  Divider,
  Typography,
  Toolbar,
  Button,
} from "@material-ui/core";
import LinkMaterial from "@material-ui/core/Link";
import { withRouter, Link } from "react-router-dom";
import {
  AppBar,
  Box,
  MenuItem,
  Popover,
  Avatar,
  Drawer,
  List,
} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core/";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SchoolIcon from "@material-ui/icons/School";
import { getAuth, signOut } from "firebase/auth";
/* import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'; */
import ListaContenido from "./lista";
import ContenidoDashboard from "./contenido_dashboard";
import { useStyles } from "./styles";
import Spin from "../../../components/Spin/spin";
import MessageSnackbar from "../../../components/Snackbar/snackbar";
import clienteAxios from "../../../config/axios";
import Error500 from "../../error500";
import SpinNormal from "../../../components/Spin/spinNormal";
import { DashboardContext } from "../../../context/dashboar_context";
import VideoCurso from "./video_curso";
import ResponsiveDashboard from "./responsive_dashboard";
import { obtenerTokenFCM } from "../../../components/Firebase/firebaseInit";
import CustomAvatar from "../../../components/CustomAvatar";
import ABHorizIcon from "../../../Icons/ABHorizIcon";

function DashboarUsuario(props) {
  const classes = useStyles();
  let user = { _id: "" };
  const token = localStorage.getItem("token");
  const [darkTheme, setDarkTheme] = props.tema;
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [openSecondary, setOpenSecondary] = useState(false);
  const {
    curso,
    setCurso,
    setProgreso,
    setEndTopic,
    updateCurso,
    setCalificado,
  } = useContext(DashboardContext);
  const slugCourse = props.match.params.url;
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    status: "",
  });
  const isMenuOpen = Boolean(anchorEl);
  const auth = getAuth();

  if (token !== null) user = JSON.parse(localStorage.getItem("student"));

  if (!token || !user) {
    props.history.push("/");
  }

  const darkModeAction = () => {
    setDarkTheme(!darkTheme);
    localStorage.setItem("tema", !darkTheme);
  };

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDrawer = () => setOpen(!open);
  const handleDrawerSecondary = () => setOpenSecondary(!openSecondary);

  const obtenerCursoBD = useCallback(async () => {
    setLoading(true);
    await clienteAxios
      .get(`/course/view/${slugCourse}/user-progress/${user._id}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setCurso(res.data);
        //console.log(res);
        //Condicionar si es ya lo
        if (
          user.rol === "Estudiante" &&
          res.data.inscriptionStudent &&
          res.data.inscriptionStudent.studentAdvance &&
          parseFloat(res.data.inscriptionStudent.studentAdvance) >= 50 &&
          (!res.data.inscriptionStudent.questionUniline ||
            res.data.inscriptionStudent.questionUniline === false)
        ) {
          props.history.push(
            `/question-curse-uniline/${res.data.course._id}/curso/${res.data.course.slug}`
          );
        }
        setProgreso(
          res.data.inscriptionStudent
            ? res.data.inscriptionStudent.studentAdvance
            : 0
        );
        setEndTopic(res.data.endTopicView);
        if (res.data.commentStudentQualification !== null) {
          setCalificado(true);
        } else {
          setCalificado(false);
        }
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
  }, [
    slugCourse,
    token,
    setCurso,
    user._id,
    setProgreso,
    setEndTopic,
    setCalificado,
    props.history,
    user.rol,
  ]);

  const signOutUser = async () => {
    const messagingToken = await obtenerTokenFCM();
    await clienteAxios
      .post("/user/signOut", { idUser: user._id, messagingToken })
      .then((res) => res)
      .catch((err) => {
        //console.log(err);
      });
    await signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem("token");
        localStorage.removeItem("student");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((error) => {
        // An error happened.
        //console.log(error);
      });
  };

  useEffect(() => {
    obtenerCursoBD();
  }, [obtenerCursoBD, updateCurso]);

  if (loading) {
    return <Spin loading={loading} />;
  }

  if (curso.length === 0) {
    if (loading) {
      return <SpinNormal />;
    } else {
      return <Error500 />;
    }
  }

  if (
    curso.inscriptionStudent === null ||
    user._id !== curso.inscriptionStudent.idUser ||
    !curso.inscriptionStudent
  ) {
    props.history.push("/");
  }

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Popover
      id={menuId}
      open={isMenuOpen}
      anchorEl={anchorEl}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <MenuItem onClick={handleMenuClose} component={Link} to="/perfil">
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary="Mi perfil" />
      </MenuItem>
      <ListItem button onClick={darkModeAction}>
        <ListItemIcon>
          {darkTheme ? <Brightness5Icon /> : <BrightnessMediumIcon />}
        </ListItemIcon>
        <ListItemText
          primary={`tema: ${darkTheme === true ? "Oscuro" : "Claro"}`}
        />
      </ListItem>
      <MenuItem onClick={() => signOutUser()}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Cerrar sesión" />
      </MenuItem>
    </Popover>
  );

  return (
    <div className={classes.root}>
      {/* <Hidden mdUp>
				<Button
					size="large"
					variant="contained"
					color="primary"
					onClick={handleDrawer}
					className={classes.iconSave}
				>
					Contenido
				</Button>
			</Hidden> */}
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar} elevation={0}>
        <Toolbar variant="dense" style={{ padding: "0px 8px" }}>
          <Hidden mdUp>
            <IconButton
              size="small"
              aria-haspopup="true"
              onClick={handleDrawerSecondary}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Hidden smDown>
            <ABHorizIcon
              size={10}
              color="primary"
              style={{ marginRight: 10 }}
            />
          </Hidden>
          <Box ml={3}>
            <Typography className={classes.title} variant="h6" noWrap>
              <LinkMaterial
                href={curso.course.slug ? `/curso/${curso.course.slug}` : null}
                target="_blank"
                rel="noopener"
                underline="none"
                color="primary"
              >
                {curso.course.title ? curso.course.title : ""}
              </LinkMaterial>
            </Typography>
          </Box>
          <div className={classes.grow} />
          <Hidden smDown>
            <Button
              style={{ textTransform: "none" }}
              color="primary"
              component={Link}
              to="/"
              className={classes.marginButton}
              startIcon={<HomeIcon />}
            >
              Inicio
            </Button>
            <Button
              color="primary"
              style={{ textTransform: "none" }}
              component={Link}
              to="/mis_cursos"
              className={classes.marginButton}
              startIcon={<VideoLibraryIcon />}
            >
              Mis cursos
            </Button>
          </Hidden>

          <Hidden smDown>
            <IconButton
              size="small"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="primary"
            >
              {!user ? (
                <CustomAvatar size={30} fontSize={17} />
              ) : !user.imagen ? (
                <CustomAvatar name={user.name} size={30} fontSize={17} />
              ) : (
                <Avatar
                  alt="foto de perfil"
                  src={user.imagen}
                  style={{ height: 30, width: 30, fontSize: 17 }}
                />
              )}
            </IconButton>
          </Hidden>
        </Toolbar>
      </AppBar>
      {renderMenu}

      <Hidden smDown>
        <Drawer
          anchor="right"
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar variant="dense" />
          <div className={classes.drawerContainer}>
            <ListaContenido props={props} curso={curso} />
          </div>
        </Drawer>
      </Hidden>

      <Hidden mdUp>
        <Drawer
          anchor="bottom"
          variant="persistent"
          classes={{
            paper: classes.drawerPaperResponsive,
          }}
          open={open}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawer}>
              <KeyboardArrowDownIcon />
            </IconButton>
          </div>
          <Divider />
          <div className={classes.drawerContainer}>
            <ListaContenido props={props} curso={curso} />
          </div>
        </Drawer>
      </Hidden>

      <Hidden mdUp>
        <Drawer
          anchor="left"
          classes={{
            paper: classes.drawerPaperSecondary,
          }}
          open={openSecondary}
          onClose={handleDrawerSecondary}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button color="primary" component={Link} to="/">
              <ABHorizIcon
                size={10}
                color="primary"
                style={{ marginRight: 10 }}
              />
            </Button>
            <IconButton onClick={handleDrawerSecondary}>
              <ArrowBackIosIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            <ListItem
              button
              component={Link}
              to="/perfil"
              onClick={handleDrawer}
            >
              <ListItemIcon>
                {!user ? (
                  <CustomAvatar />
                ) : !user.imagen ? (
                  <CustomAvatar name={user.name} />
                ) : (
                  <Avatar alt="foto de perfil" src={user.imagen} />
                )}
              </ListItemIcon>
              <ListItemText primary="Mi perfil" />
            </ListItem>
            <ListItem button onClick={handleDrawer} component={Link} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Inicio" />
            </ListItem>
            <ListItem
              button
              onClick={handleDrawer}
              component={Link}
              to="/mis_cursos"
            >
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Mis cursos" />
            </ListItem>
            <ListItem button onClick={darkModeAction}>
              <ListItemIcon>
                {darkTheme ? <Brightness5Icon /> : <BrightnessMediumIcon />}
              </ListItemIcon>
              <ListItemText
                primary={`tema: ${darkTheme === true ? "Oscuro" : "Claro"}`}
              />
            </ListItem>
            <ListItem button onClick={() => signOutUser()}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </ListItem>
          </List>
        </Drawer>
      </Hidden>

      <main className={classes.content}>
        <Toolbar variant="dense" />
        <VideoCurso props={props} user={user} />
        <Hidden mdUp>
          <ResponsiveDashboard user={user} curso={curso} />
        </Hidden>
        <Hidden smDown>
          <ContenidoDashboard user={user} />
        </Hidden>

        {/* </Hidden> */}

        {/* HIDDEN */}

        <Spin loading={loading} />
        <MessageSnackbar
          open={snackbar.open}
          mensaje={snackbar.mensaje}
          status={snackbar.status}
          setSnackbar={setSnackbar}
        />
      </main>
    </div>
  );
}

export default withRouter(DashboarUsuario);
