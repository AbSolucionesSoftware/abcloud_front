import React, { Fragment, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { MenuItem, Popover, Drawer, Box, IconButton } from "@material-ui/core";
import {
  Button,
  Hidden,
  AppBar,
  Toolbar,
  InputBase,
  CircularProgress,
} from "@material-ui/core";
import {
  Avatar,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import HomeIcon from "@material-ui/icons/Home";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DashboardIcon from "@material-ui/icons/Dashboard";
import SettingsIcon from "@material-ui/icons/Settings";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import SchoolIcon from "@material-ui/icons/School";
import useStyles from "./styles";
import CarritoNavbar from "./carrito";
import CategoriesContainer from "./NavSubcategories";
import { Devices } from "@material-ui/icons";
import Notifications from "../Notifications/Notifications";
import BottomNavigationResponsive from "./NavegacionResponsive";
import { getAuth, signOut } from "firebase/auth";
import { obtenerTokenFCM } from "../Firebase/firebaseInit";
import clienteAxios from "../../config/axios";
import CustomAvatar from "../CustomAvatar";
import ABHorizIcon from "../../Icons/ABHorizIcon";

function NavegacionUsuario(props) {
  const [darkTheme, setDarkTheme] = props.tema;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const isMenuOpen = Boolean(anchorEl);
  let user = { _id: "" };
  let token = localStorage.getItem("token");
  const auth = getAuth();

  if (token !== "null") user = JSON.parse(localStorage.getItem("student"));

  const darkModeAction = () => {
    setDarkTheme(!darkTheme);
    localStorage.setItem("tema", !darkTheme);
  };

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDrawerAction = () => setOpen(!open);

  const obtenerBusqueda = (e) => setBusqueda(e.target.value);
  const buscarBD = () => {
    if (!busqueda) {
      return;
    }
    /* setBusqueda(''); */
    props.history.push(`/busqueda/${busqueda}`);
  };

  const pressEnter = (e) => {
    if (!e.target.defaultValue) return;
    if (e.key === "Enter")
      props.history.push(`/busqueda/${e.target.defaultValue}`);
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
        localStorage.removeItem("student");
        localStorage.removeItem("urlActual");
        window.location.reload();
        setLoading(false);
      })
      .catch((error) => {
        // An error happened.
        setLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    localStorage.removeItem("urlActual");
  }, []);

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
      {token && user.rol === "Maestro" ? (
        <MenuItem
          onClick={handleMenuClose}
          component={Link}
          to="/instructor/cursos"
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </MenuItem>
      ) : (
        <div />
      )}
      <Divider />
      <MenuItem onClick={handleMenuClose} component={Link} to="/perfil">
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Mi cuenta" />
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
      <AppBar position="fixed" className={classes.appbar} elevation={0}>
        <Toolbar variant="dense" style={{ padding: "0px 8px" }}>
          <Hidden mdUp>
            <IconButton
              edge="start"
              aria-label="show more"
              aria-haspopup="true"
              onClick={handleDrawerAction}
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
          <div className={classes.search}>
            <InputBase
              placeholder="Buscar"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              value={busqueda}
              onChange={obtenerBusqueda}
              onKeyPress={pressEnter}
            />
            <div className={classes.grow} />
            <IconButton size="small" color="primary" onClick={() => buscarBD()}>
              <SearchIcon />
            </IconButton>
          </div>
          <div className={classes.grow} />
          <Hidden smDown>
            <Button
              style={{ textTransform: "none" }}
              color="primary"
              component={Link}
              to="/"
              className={classes.marginButton}
              /* startIcon={<Home />} */
            >
              Inicio
            </Button>
            <Button
              style={{ textTransform: "none" /* backgroundColor: "#ff1744" */ }}
              color="primary"
              component={Link}
              to="/apps"
              //variant="contained"
              size="small"
              className={classes.marginButton}
              disableElevation
              //startIcon={<Devices />}
            >
              Apps
            </Button>
            <Button
              style={{ textTransform: "none" }}
              color="primary"
              component={Link}
              to="/buscar-certificado"
              className={classes.marginButton}
              /* startIcon={<SchoolIcon />} */
            >
              Certificados
            </Button>
            {!token ? (
              <Fragment>
                <Button
                  style={{ textTransform: "none" }}
                  color="primary"
                  component={Link}
                  to="/registro"
                  className={classes.marginButton}
                  size="small"
                >
                  Regístrate
                </Button>
                <Button
                  style={{
                    textTransform: "none",
                    //backgroundColor: "#ff1744",
                  }}
                  color="primary"
                  disableElevation
                  component={Link}
                  to="/login"
                  className={classes.marginButton}
                  size="small"
                >
                  Inicia Sesión
                </Button>
              </Fragment>
            ) : null}

            {token ? (
              <Button
                style={{ textTransform: "none" }}
                color="primary"
                component={Link}
                to="/mis_cursos"
                className={classes.marginButton}
                /* startIcon={<VideoLibraryIcon />} */
              >
                Mis cursos
              </Button>
            ) : (
              <div />
            )}
            {/* {token && user.rol === "Maestro" ? (
                <Button
                  style={{ textTransform: "none" }}
                  color="primary"
                  component={Link}
                  to="/instructor/cursos"
                  className={classes.marginButton}
                  startIcon={<DashboardIcon />}
                >
                  Dashboard
                </Button>
              ) : (
                <div />
              )} */}
            {token ? (
              <Fragment>
                <IconButton
                  size="small"
                  color="primary"
                  component={Link}
                  to="/carrito"
                >
                  <CarritoNavbar />
                </IconButton>
                <Notifications />
              </Fragment>
            ) : (
              <div />
            )}
            {token ? (
              <IconButton
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                size="small"
              >
                {!user.imagen ? (
                  <CustomAvatar name={user.name} size={30} fontSize={17} />
                ) : (
                  <Avatar
                    alt="foto de perfil"
                    src={user.imagen}
                    style={{ height: 30, width: 30, fontSize: 17 }}
                  />
                )}
              </IconButton>
            ) : (
              <div />
            )}
            {!token ? (
              <IconButton
                aria-label="show 17 theme config"
                color="primary"
                onClick={darkModeAction}
              >
                {darkTheme ? <Brightness5Icon /> : <BrightnessMediumIcon />}
              </IconButton>
            ) : (
              <div />
            )}
          </Hidden>
          {/* <Hidden mdUp>
              <IconButton
                aria-label="show 17 new notifications"
                color="primary"
                component={Link}
                to="/carrito"
              >
                <CarritoNavbar />
              </IconButton>
            </Hidden> */}
        </Toolbar>
        <Hidden smDown>
          <Box width="100%" className={classes.backgroundCategories}>
            <CategoriesContainer />
          </Box>
        </Hidden>
      </AppBar>
      {renderMenu}
      <Drawer
        className={classes.drawer}
        anchor="left"
        open={open}
        onClose={handleDrawerAction}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <ABHorizIcon size={10} color="primary" style={{ marginRight: 10 }} />
          <div className={classes.grow} />
          <IconButton onClick={handleDrawerAction}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button component={Link} to="/" onClick={handleDrawerAction}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/apps"
            onClick={handleDrawerAction}
          >
            <ListItemIcon>
              <Devices />
            </ListItemIcon>
            <ListItemText primary="Apps" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/buscar-certificado"
            onClick={handleDrawerAction}
          >
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText primary="Verificar certificados" />
          </ListItem>
          {token ? (
            <ListItem
              button
              component={Link}
              to="/mis_cursos"
              onClick={handleDrawerAction}
            >
              <ListItemIcon>
                <VideoLibraryIcon />
              </ListItemIcon>
              <ListItemText primary="Mis cursos" />
            </ListItem>
          ) : (
            <div />
          )}
          {token && user.rol === "Maestro" ? (
            <ListItem
              button
              component={Link}
              to="/instructor/cursos"
              onClick={handleDrawerAction}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          ) : (
            <div />
          )}
          {token ? (
            <ListItem
              button
              component={Link}
              to="/carrito"
              onClick={handleDrawerAction}
            >
              <ListItemIcon>
                <CarritoNavbar />
              </ListItemIcon>
              <ListItemText primary="Carrito" />
            </ListItem>
          ) : (
            <div />
          )}
        </List>
        <Divider />
        <List>
          {!token ? (
            <ListItem
              button
              component={Link}
              to="/login"
              onClick={handleDrawerAction}
            >
              <ListItemIcon>
                <MeetingRoomIcon />
              </ListItemIcon>
              <ListItemText primary="Iniciar sesión" />
            </ListItem>
          ) : (
            <div />
          )}
          {!token ? (
            <ListItem
              button
              component={Link}
              to="/registro"
              onClick={handleDrawerAction}
            >
              <ListItemIcon>
                <HowToRegIcon />
              </ListItemIcon>
              <ListItemText primary="Regístrate" />
            </ListItem>
          ) : (
            <div />
          )}
          {token ? (
            <ListItem
              button
              component={Link}
              to="/perfil"
              onClick={handleDrawerAction}
            >
              <ListItemIcon>
                {!user.imagen ? (
                  <CustomAvatar name={user.name} size={30} fontSize={17} />
                ) : (
                  <Avatar
                    alt="foto de perfil"
                    src={user.imagen}
                    style={{ height: 30, width: 30, fontSize: 17 }}
                  />
                )}
              </ListItemIcon>
              <ListItemText primary="Mi cuenta" />
            </ListItem>
          ) : (
            <div />
          )}
          <ListItem button onClick={darkModeAction}>
            <ListItemIcon>
              {darkTheme ? <Brightness5Icon /> : <BrightnessMediumIcon />}
            </ListItemIcon>
            <ListItemText
              primary={`tema: ${darkTheme === true ? "Oscuro" : "Claro"}`}
            />
          </ListItem>
          {token ? (
            <ListItem button onClick={() => signOutUser()}>
              <ListItemIcon>
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <ExitToAppIcon color="error" />
                )}
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItem>
          ) : (
            <div />
          )}
        </List>
      </Drawer>
      <BottomNavigationResponsive props={props} />
      <div className={classes.offset} />
    </div>
  );
}
export default withRouter(NavegacionUsuario);
