import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import Badge from "@material-ui/core/Badge";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { BottomNavigationAction, styled } from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";

const useStyles = makeStyles({
  root: {
    height: "50vh",
  },
  image: {
    height: 52,
    width: 52,
  },
  divider: {
    margin: "0px 16px 0px 16px",
    height: 0.5,
  },
  itemContainer: {
    display: "flex",
    alignItems: "flex-start"
  },
});

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.action.disabled,
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

export default function NotificationResponsive() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const notifications = JSON.parse(
    localStorage.getItem("notifications_uniline")
  );

  const count = notifications.filter((res) => !res.read);

  const toggleDrawer = () => setOpen(!open);

  return (
    <Fragment>
      <BottomNavigationAction
        icon={
          <Badge
            badgeContent={count.length}
            color="secondary"
            onClick={() => toggleDrawer()}
          >
            <NotificationsIcon htmlColor="#fff" style={{ fontSize: 30 }} />
          </Badge>
        }
      />
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => toggleDrawer()}
        onOpen={() => toggleDrawer()}
      >
        <Puller />
        {!notifications.length ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            pt={3}
          >
            <Typography variant="h6" color="textSecondary">
              No hay notificaciones
            </Typography>
          </Box>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            pt={3}
          >
            <Typography color="textSecondary" variant="h6" align="center">
              Notificaciones
            </Typography>
          </Box>
        )}

        <List className={classes.root}>
          {notifications.map((notification, index) => (
            <Box key={index}>
              <ItemNotification
                index={index}
                notification={notification}
                notificaciones={notifications}
                handleClose={toggleDrawer}
              />
              {index !== notifications.length - 1 ? (
                <Divider className={classes.divider} />
              ) : null}
            </Box>
          ))}
        </List>
      </SwipeableDrawer>
    </Fragment>
  );
}

const ItemNotification = ({ notification, notificaciones, index, handleClose }) => {
  const classes = useStyles();

  const redirection = () => {
    let notificationUpdated = { ...notification, read: true };
    let notificationToLS = [...notificaciones];
    notificationToLS.splice(index, 1, notificationUpdated);
    localStorage.setItem(
      "notifications_uniline",
      JSON.stringify(notificationToLS)
    );
    if (notification.url) window.open(notification.url, '_blank');
    handleClose()
  };

  return (
    <ListItem className={classes.itemContainer} button onClick={redirection}>
      <Badge
        variant="dot"
        badgeContent={!notification.read ? 1 : 0}
        color="secondary"
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        style={{marginTop: 12, marginRight: 4}}
      >
        <ListItemAvatar>
          <Avatar
            variant="rounded"
            src={notification.image ? notification.image : ""}
            className={classes.image}
          >
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
      </Badge>

      <ListItemText
        primary={`${
          notification.name_teacher ? `${notification.name_teacher}: ` : ""
        } ${notification.title ? notification.title : ""}`}
        secondary={notification.description ? notification.description : ""}
      />
    </ListItem>
  );
};
