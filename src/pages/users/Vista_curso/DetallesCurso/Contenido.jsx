import React, { Fragment } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import { Box, Typography, makeStyles } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PreviewVideo from "./PreviewVideo";

const useStyles = makeStyles((theme) => ({
  acordionDetails: {
    padding: 0,
  },
  listItem: {
    padding: 0,
    marginLeft: 24,
    [theme.breakpoints.down("sm")]:{
      marginLeft: 16,
    }
  }
}));

export default function Contenido({ curso }) {
  const classes = useStyles();

  return (
    <>
      <Box id="programa" style={{ scrollMarginTop: "12em" }}>
        <Box mb={2}>
          <Typography variant="h6">Programa o contenido</Typography>
          <Divider />
        </Box>
        <Box>
          {curso.contentCourse.map((res, index) => {
            return (
              <Fragment key={index}>
                <Accordion variant="outlined" style={{ border: 0 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{res.block.blockTitle}</Typography>
                  </AccordionSummary>
                  <AccordionDetails className={classes.acordionDetails}>
                    <List style={{width: "100%", padding: 0}}>
                      {res.topics.map((topic, index) => {
                        return (
                          <ListItem key={topic._id} className={classes.listItem}>
                            <ListItemText >
                            {`${index + 1} ${
                                topic.topicTitle
                              }`}
                            </ListItemText>
                            <ListItemSecondaryAction style={{display: "flex", alignItems: "center"}}>
                              <PreviewVideo topic={topic} />
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })}
                    </List>
                  </AccordionDetails>
                </Accordion>
                <Divider />
              </Fragment>
            );
          })}
        </Box>
      </Box>
    </>
  );
}
