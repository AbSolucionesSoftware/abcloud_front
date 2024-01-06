import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Box, Divider, makeStyles } from "@material-ui/core";
import { HashLink } from "react-router-hash-link";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  sticky: {
    position: "sticky",
    top: theme.spacing(10),
    backgroundColor: theme.palette.background.paper,
    zIndex: 99,
    [theme.breakpoints.down("xs")]: {
      top: theme.spacing(6),
    }
  },
}));

function MenuAnclas({ location }) {
  const [value, setValue] = React.useState(location.hash);
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className={classes.sticky}>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="disabled tabs example"
      >
        <Tab
          label="Adquirir"
          value="adquirir"
          component={HashLink}
          to="#adquirir"
          smooth="true"
        />
        <Tab
          label="Descripción"
          value="descripcion"
          component={HashLink}
          to="#descripcion"
          smooth="true"
        />
        <Tab
          label="Aprendizaje"
          value="aprendizaje"
          component={HashLink}
          to="#aprendizaje"
          smooth="true"
        />
        <Tab
          label="Programa"
          value="programa"
          component={HashLink}
          to="#programa"
          smooth="true"
        />
        <Tab
          label="Reseñas y comentarios"
          value="comentarios"
          component={HashLink}
          to="#comentarios"
          smooth="true"
        />
      </Tabs>
      <Divider />
    </Box>
  );
}

export default withRouter(MenuAnclas);
