import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import Typography from "@material-ui/core/Typography";
import CloudDone from "@material-ui/icons/CloudDone";
import CloudOff from "@material-ui/icons/CloudOff";
import ToggleActive from "./ToggleActive";
import CrearPackage from "../../CrearPaquetes/CrearPackage";
import ArchivePackage from "./ArchivePackage";
import { CardMedia } from "@material-ui/core";

const useStyles = makeStyles({
  avatarGroup: {
    display: "flex",
    justifyContent: "center",
  },
  avatar: {
    height: 130,
    width: 130,
  },
  container: {
    height: 170,
  },
  avatarContainer: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function ItemPackage({ data, archived }) {
  const classes = useStyles();

  return (
    <Card variant="outlined">
      {data.archived ? null : (
        <CardHeader
          style={{
            padding: 0,
            textAlign: "center",
            backgroundColor: data.active ? "#dcedc8" : "#eeeeee",
          }}
          subheader={
            data.active ? (
              <Box
                justifyContent="center"
                display="flex"
                alignItems="center"
                style={{ color: "#0000008A" }}
              >
                <CloudDone />
                <Box mx={1} />
                {` Publicado`}
              </Box>
            ) : (
              <Box
                justifyContent="center"
                display="flex"
                alignItems="center"
                style={{ color: "#0000008A" }}
              >
                <CloudOff />
                <Box mx={1} />
                {` No publicado`}
              </Box>
            )
          }
        />
      )}
      <Box className={classes.container}>
        {data.image ? (
          <CardMedia style={{ height: "100%" }} image={data.image} />
        ) : (
          <Box className={classes.avatarContainer}>
            <AvatarGroup max={4} className={classes.avatarGroup}>
              {data.courses.map((res, index) => (
                <Avatar
                  key={index}
                  className={classes.avatar}
                  alt={`curso ${index}`}
                  src={res.course?.urlPromotionalImage}
                />
              ))}
            </AvatarGroup>
          </Box>
        )}
      </Box>
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {data.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p" noWrap>
          {data.description}
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: "space-around" }}>
        {archived ? null : (
          <React.Fragment>
            <ToggleActive data={data} />
            <CrearPackage updating={true} data={data} />
          </React.Fragment>
        )}
        <ArchivePackage data={data} />
      </CardActions>
    </Card>
  );
}
