import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActionArea from "@material-ui/core/CardActionArea";
/* import CardActions from "@material-ui/core/CardActions"; */
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import EditarBanner from "./CrearBanner";
/* import ViewBanner from "./ViewBanner"; */
import EliminarBanner from "./EliminarBanner";
import { Draggable } from "react-beautiful-dnd";
import { Avatar } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import LinkMaterial from "@material-ui/core/Link";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  img_devices_container: {
    height: 90,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  img_devices: {
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto 100px",
    height: "100%",
    width: "100%",
  },
  media: {
    height: 140,
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  avatar_floating: {
    position: "relative",
    top: theme.spacing(2),
    width: theme.spacing(4),
    height: theme.spacing(4),
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[400],
  },
}));

export default function CardBanner({
  index,
  banner,
  update,
  setUpdate,
  courses,
  setSnackbar,
}) {
  const classes = useStyles();

  return (
    <Draggable draggableId={`banner-${banner._id}`} index={index}>
      {(provided) => (
        <Grid
          item
          md={3}
          xs={12}
          ref={provided.innerRef}
          {...provided.draggableProps} /* {...provided.dragHandleProps} */
        >
          <Avatar className={classes.avatar_floating}>{index + 1}</Avatar>
          <Card>
            <CardHeader
              style={{
                paddingTop: 4,
                paddingBottom: 4,
                display: "flex",
                justifyContent: "space-around",
              }}
              action={[
                <EliminarBanner
                  key="delete"
                  aria-label="deleting"
                  banner={banner}
                  setUpdate={setUpdate}
                  update={update}
                />,
                <EditarBanner
                  key="editing"
                  aria-label="editing"
                  banner={banner}
                  setUpdate={setUpdate}
                  update={update}
                  view="editar"
                  courses={courses}
                  setSnackbar={setSnackbar}
                />,
                <IconButton
                  disableRipple
                  aria-label="drag"
                  key="dragable"
                  {...provided.dragHandleProps}
                >
                  <DragIndicatorIcon />
                </IconButton>,
              ]}
              /* title={<Avatar className={classes.avatar}>{index+1}</Avatar>} */
            />
            <CardActionArea >
              <LinkMaterial
                component={Link}
                to={banner.course_ref ? `/curso/${banner.course_ref}` : "#"}
                underline="none"
                color="inherit"
                target={banner.course_ref ? "_blank" : null}
              >
                <CardMedia
                  className={classes.media}
                  image={banner.image_desktop}
                  title={
                    banner.course_name
                      ? `banner uniline ${banner.course_name}`
                      : `banner uniline ${banner.key_desktop}`
                  }
                />
                <CardContent>
                  <Typography color="textSecondary" noWrap>
                    {banner.course_name ? banner.course_name : `No vinculado`}
                  </Typography>
                  {/* <Box display="flex">
              <Grid container spacing={1}>
                <Grid item sm={6} xs={12}>
                  <Typography gutterBottom variant="subtitle1" component="h2">
                    Imagen para dispositivos moviles
                  </Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Box
                    boxShadow={1}
                    className={classes.img_devices}
                    style={{ backgroundImage: `url(${banner.image_devices})` }}
                  >
                  </Box>
                </Grid>
              </Grid>
            </Box> */}
                </CardContent>
              </LinkMaterial>
            </CardActionArea>
            {/* <CardActions style={{ justifyContent: "space-around" }}>
          <ViewBanner banner={banner} />
          <EditarBanner
            banner={banner}
            setUpdate={setUpdate}
            update={update}
            view="editar"
            courses={courses}
          />
          <EliminarBanner
            banner={banner}
            setUpdate={setUpdate}
            update={update}
          />
        </CardActions> */}
          </Card>
        </Grid>
      )}
    </Draggable>
  );
}
