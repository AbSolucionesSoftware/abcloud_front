import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import HomeIcon from "@material-ui/icons/Home";
import { Box, Hidden } from "@material-ui/core";
import CarritoNavbar from "./carrito";
import Notifications from "../Notifications/Notifications";
import CategoriasResponsive from "./SubNavResponsive";
import { Person } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.primary.main,
    position: "fixed",
    zIndex: 9999,
    bottom: 0,
  },
}));

export default function BottomNavigationResponsive(props) {
  const classes = useStyles();
  let token = localStorage.getItem("token");

  return (
    <Hidden mdUp>
      <BottomNavigation className={classes.root}>
        <BottomNavigationAction
          icon={
            <Box onClick={() => props.props.history.push("/")}>
              <HomeIcon htmlColor="#fff" style={{ fontSize: 32 }} />
            </Box>
          }
        />
        <CategoriasResponsive />
        {token ? <Notifications responsive={true} /> : null}
        {token ? (
          <CarritoNavbar props={props} responsive={true} />
        ) : (
          <BottomNavigationAction
            icon={
              <Box onClick={() => props.props.history.push("/login")}>
                <Person htmlColor="#fff" style={{ fontSize: 32 }} />
              </Box>
            }
          />
        )}
      </BottomNavigation>
    </Hidden>
  );
}
