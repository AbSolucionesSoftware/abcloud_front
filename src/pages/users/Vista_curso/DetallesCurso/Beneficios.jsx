import React from "react";
import { List, ListItem, ListItemIcon, ListItemText, makeStyles } from "@material-ui/core";
import { Box, Grid } from "@material-ui/core";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";
import MobileFriendlyIcon from "@material-ui/icons/MobileFriendly";
import SchoolIcon from "@material-ui/icons/School";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import LanguageIcon from "@material-ui/icons/Language";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import FolderOpenOutlinedIcon from "@material-ui/icons/FolderOpenOutlined";

const useStyles = makeStyles((theme) => ({
  sticky: {
    position: "sticky",
    top: theme.spacing(20),
    [theme.breakpoints.down("xs")]: {
      position: "inherit",
    }
  },
}));

export default function Beneficios({ curso }) {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.sticky}>
        <Grid container>
          <Grid item>
            <List>
              <ListItem>
                <ListItemIcon>{<AccessTimeIcon />}</ListItemIcon>
                <ListItemText
                  primary={`${curso.course.hours} horas de curso`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>{<SubscriptionsIcon />}</ListItemIcon>
                <ListItemText
                  primary={`${curso.totalTopics} temas disponibles`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>{<AllInclusiveIcon />}</ListItemIcon>
                <ListItemText primary="Acceso de por vida" />
              </ListItem>
              <ListItem>
                <ListItemIcon>{<MobileFriendlyIcon />}</ListItemIcon>
                <ListItemText primary="Acceso desde dispositivos móviles" />
              </ListItem>
            </List>
          </Grid>
          <Grid item>
            <List>
              <ListItem>
                <ListItemIcon>{<SchoolIcon />}</ListItemIcon>
                <ListItemText primary="Certificado al finalizar" />
              </ListItem>
              <ListItem>
                <ListItemIcon>{<LanguageIcon />}</ListItemIcon>
                <ListItemText
                  primary={`Lenguaje en ${curso.course.language}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>{<AssessmentOutlinedIcon />}</ListItemIcon>
                <ListItemText primary={`Nivel ${curso.course.level}`} />
              </ListItem>
              <ListItem>
                <ListItemIcon>{<FolderOpenOutlinedIcon />}</ListItemIcon>
                <ListItemText primary="Trabajo final" />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
