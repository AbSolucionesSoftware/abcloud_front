import React, { Fragment, useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  Hidden,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange } from "@material-ui/core/colors";
import CircularProgress from "@material-ui/core/CircularProgress";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
//import CategoryIcon from "@material-ui/icons/Category";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
//import ShopTwoIcon from "@material-ui/icons/ShopTwo";
//import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
/* import EqualizerIcon from '@material-ui/icons/Equalizer'; */
import Notifications from "@material-ui/icons/Notifications";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import SettingsIcon from "@material-ui/icons/Settings";
import PanoramaIcon from "@material-ui/icons/Panorama";
/* import BugReportIcon from "@material-ui/icons/BugReport"; */
import { Link } from "react-router-dom";
/* import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"; */
import { getAuth, signOut } from "firebase/auth";
import { obtenerTokenFCM } from "../Firebase/firebaseInit";
import clienteAxios from "../../config/axios";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import CustomAvatar from "../CustomAvatar";
import { Receipt } from "@material-ui/icons";
//import { Widgets } from "@material-ui/icons";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    backgroundColor: theme.palette.primary,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 26,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(7) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    //padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    //...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  divider: {
    backgroundColor: theme.palette.background.paper,
    height: 24,
    width: 0.5,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  selected: {
    backgroundColor: fade("#0000", 0.05),
    "& svg": {
      color: theme.palette.primary.main,
    },
  },
}));

export default function NavbarMaestro(props) {
  const [darkTheme, setDarkTheme] = props.tema;
  const token = localStorage.getItem("token");
  const classes = useStyles();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMenuOpen = Boolean(anchorEl);
  let user = { _id: "", name: "", imagen: "" };
  const ruta_actual = props.props.location.pathname.split("/");
  const [title, setTitle] = useState(
    ruta_actual[2] === "registro_usuarios"
      ? "Usuarios registrados"
      : ruta_actual[2] === "cursos"
      ? "Tus cursos"
      : ruta_actual[2] === "paymentlinks"
      ? "Enlaces de pago"
      : ruta_actual[2] === "estadisticas"
      ? "Estadisticas"
      : ruta_actual[2] === "categorias"
      ? "Categorias"
      : ruta_actual[2] === "productos"
      ? "Productos y servicios"
      : ruta_actual[2] === "banner"
      ? "Banners"
      : ruta_actual[2] === "notificaciones"
      ? "Notificaciones"
      : ruta_actual[2] === "ventas"
      ? "Ventas"
      : ruta_actual[2] === "paquetes"
      ? "Paquetes de promoción"
      : ruta_actual[2] === "homedesign"
      ? "Secciones Home"
      : ""
  );
  const auth = getAuth();

  if (token !== null) user = JSON.parse(localStorage.getItem("student"));

  const darkModeAction = () => {
    setDarkTheme(!darkTheme);
    localStorage.setItem("tema", !darkTheme);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const signOutUser = async () => {
    setLoading(true);
    const messagingToken = await obtenerTokenFCM();
    await clienteAxios
      .post("/user/signOut", { idUser: user._id, messagingToken })
      .then((res) => res)
      .catch((err) => {
        console.log(err);
      });
    await signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem("token");
        localStorage.removeItem("vistaPrevia");
        localStorage.removeItem("student");
        window.location.reload();
        setLoading(false);
      })
      .catch((error) => {
        // An error happened.
        setLoading(false);
        console.log(error);
      });
  };

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
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Mi cuenta" />
      </MenuItem>
      <MenuItem onClick={darkModeAction}>
        <ListItemIcon>
          {darkTheme ? <Brightness5Icon /> : <BrightnessMediumIcon />}
        </ListItemIcon>
        <ListItemText
          primary={`tema: ${darkTheme === true ? "Oscuro" : "Claro"}`}
        />
      </MenuItem>
      <MenuItem onClick={() => signOutUser()}>
        <ListItemIcon>
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <ExitToAppIcon color="error" />
          )}
        </ListItemIcon>
        <ListItemText primary="Cerrar sesión" />
      </MenuItem>
    </Popover>
  );

  return (
    <div>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            size="small"
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Hidden xsDown>
            <Typography noWrap>
              <b>
                {user.name
                  ? `👋 Hola, ${user.name.split(" ")[0]}`
                  : "Dashboard instructor"}
              </b>
            </Typography>
            <Divider orientation="vertical" className={classes.divider} />
          </Hidden>
          <Typography noWrap className={classes.title}>
            <b>{title}</b>
          </Typography>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            {!token ? (
              <CustomAvatar size={30} fontSize={16} />
            ) : !user.imagen ? (
              <CustomAvatar size={30} fontSize={16} name={user.name} />
            ) : (
              <Avatar
                alt="foto de perfil"
                src={user.imagen}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem
            button
            component={Link}
            to="/instructor/cursos"
            onClick={() => {
              setTitle("Tus cursos");
              handleDrawerClose();
            }}
            className={title === "Tus cursos" ? classes.selected : ""}
          >
            <ListItemIcon>
              <SubscriptionsIcon />
            </ListItemIcon>
            <ListItemText primary="Cursos" />
          </ListItem>
          {/* <ListItem
            button
            component={Link}
            to="/instructor/paquetes"
            onClick={() => {
              setTitle("Paquetes de promoción");
              handleDrawerClose();
            }}
            className={
              title === "Paquetes de promoción" ? classes.selected : ""
            }
          >
            <ListItemIcon>
              <ShopTwoIcon />
            </ListItemIcon>
            <ListItemText primary="Paquetes" />
          </ListItem> */}
          {/* {user && user.admin === true ? (
            <ListItem
              button
              component={Link}
              to="/instructor/productos"
              onClick={() => {
                setTitle("Productos y servicios");
                handleDrawerClose();
              }}
              className={title === "Productos y servicios" ? classes.selected : ""}
            >
              <ListItemIcon>
                <Widgets />
              </ListItemIcon>
              <ListItemText primary="Productos" />
            </ListItem>
          ) : null} */}
          {/* {user && user.admin === true ? (
            <ListItem
              button
              component={Link}
              to="/instructor/categorias"
              onClick={() => {
                setTitle("Categorias");
                handleDrawerClose();
              }}
              className={title === "Categorias" ? classes.selected : ""}
            >
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Categorias" />
            </ListItem>
          ) : null} */}
          {user && user.admin === true ? (
            <ListItem
              button
              component={Link}
              to="/instructor/paymentlinks"
              onClick={() => {
                setTitle("Enlaces de pago");
                handleDrawerClose();
              }}
              className={title === "Enlaces de pago" ? classes.selected : ""}
            >
              <ListItemIcon>
                <Receipt />
              </ListItemIcon>
              <ListItemText primary="Enlaces de pago" />
            </ListItem>
          ) : null}
          {user && user.admin === true ? (
            <Fragment>
              <ListItem
                button
                component={Link}
                to="/instructor/ventas"
                onClick={() => {
                  setTitle("Ventas");
                  handleDrawerClose();
                }}
                className={title === "Ventas" ? classes.selected : ""}
              >
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Ventas" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/instructor/registro_usuarios"
                onClick={() => {
                  setTitle("Usuarios registrados");
                  handleDrawerClose();
                }}
                className={
                  title === "Usuarios registrados" ? classes.selected : ""
                }
              >
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText primary="Usuarios" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/instructor/banner"
                onClick={() => {
                  setTitle("Banners");
                  handleDrawerClose();
                }}
                className={title === "Banners" ? classes.selected : ""}
              >
                <ListItemIcon>
                  <PanoramaIcon />
                </ListItemIcon>
                <ListItemText primary="Banner" />
              </ListItem>
              {/* <ListItem
                button
                component={Link}
                to="/instructor/homedesign"
                onClick={() => {
                  setTitle("Secciones Home");
                  handleDrawerClose();
                }}
                className={title === "Secciones Home" ? classes.selected : ""}
              >
                <ListItemIcon>
                  <ViewQuiltIcon />
                </ListItemIcon>
                <ListItemText primary="Secciones Home" />
              </ListItem> */}
              <ListItem
                button
                component={Link}
                to="/instructor/notificaciones"
                onClick={() => {
                  setTitle("Notificaciones");
                  handleDrawerClose();
                }}
                className={title === "Notificaciones" ? classes.selected : ""}
              >
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText primary="Notificaciones" />
              </ListItem>
              {/* <ListItem
                button
                component={Link}
                to="/instructor/registro-errores"
                onClick={() => {
                  setTitle("Regístro de errores");
                  handleDrawerClose();
                }}
                className={
                  title === "Regístro de errores" ? classes.selected : ""
                }
              >
                <ListItemIcon>
                  <BugReportIcon />
                </ListItemIcon>
                <ListItemText primary="Regístro de errores" />
              </ListItem> */}
              <ListItem
                button
                component={Link}
                to="/instructor/preguntas-uniline"
                onClick={() => {
                  setTitle("Preguntas encuenta");
                  handleDrawerClose();
                }}
                className={
                  title === "Preguntas encuenta" ? classes.selected : ""
                }
              >
                <ListItemIcon>
                  <QuestionAnswerIcon />
                </ListItemIcon>
                <ListItemText primary="Preguntas encuenta" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/instructor/respuestas-encuenta"
                onClick={() => {
                  setTitle("Respuestas encuesta");
                  handleDrawerClose();
                }}
                className={
                  title === "Respuestas encuesta" ? classes.selected : ""
                }
              >
                <ListItemIcon>
                  <RecordVoiceOverIcon />
                </ListItemIcon>
                <ListItemText primary="Respuestas encuesta" />
              </ListItem>
            </Fragment>
          ) : null}
          <ListItem button component={Link} to="/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Pagina principal" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}
