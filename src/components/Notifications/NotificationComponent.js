import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import NotificationsIcon from "@material-ui/icons/Notifications";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import NotificationsPausedIcon from "@material-ui/icons/NotificationsPaused";
import { ListItemIcon } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  itemContainer: {
    width: "420px",
    display: "flex",
    alignItems: "flex-start"
  },
  image: {
    height: 52,
    width: 52,
    marginRight: 8,
  },
  divider: {
    margin: "0px 16px 0px 16px",
    height: 0.5,
  },
}));

export default function NotificationComponent() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const notifications = JSON.parse(
    localStorage.getItem("notifications_uniline")
  );

  const count = notifications.filter((res) => !res.read);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <IconButton aria-describedby={id} color="inherit" onClick={handleClick}>
        <Badge badgeContent={count.length} color="secondary">
          <NotificationsIcon fontSize="small" />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <List className={classes.root}>
          {!notifications.length ? (
            <ListItem>
              <ListItemIcon>
                <NotificationsPausedIcon />
              </ListItemIcon>
              <ListItemText primary="No hay notificaciones" />
            </ListItem>
          ) : null}
          {notifications.map((notification, index) => (
            <Box key={index}>
              <ItemNotification
                index={index}
                notification={notification}
                notificaciones={notifications}
                handleClose={handleClose}
              />
              {index !== notifications.length - 1 ? (
                <Divider className={classes.divider} />
              ) : null}
            </Box>
          ))}
        </List>
      </Popover>
    </div>
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
