import React from "react";
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import DashboardMaestro from "./dashboard";
import PackagesCourses from "../PackagesCourses/PackagesIndex";
import Productos from "../Productos";
import Categorias from "../Categorias/Categorias";
import { Category, ShopTwo, Subscriptions, Widgets } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box py={2}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`,
  };
}

const useStyles = makeStyles({
  root: {
    minHeight: "40px!important",
    "& .MuiTab-root": {
      minHeight: "100%",
      padding: 8,
      marginLeft: 0,
      minWidth: 100
    },
    "& .MuiTab-wrapper": {
      flexDirection: "row",
      alignItems: "center",
      
    },
    "& .MuiTab-labelIcon .MuiTab-wrapper > *:first-child": {
        marginBottom: 0,
        marginRight: "8px"
      }
  },
});

export default function DashboardPrincipal(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        classes={{
          root: classes.root,
        }}
      >
        <Tab icon={<Subscriptions />} label="Cursos" {...a11yProps(0)} />
        <Tab icon={<ShopTwo />} label="Paquetes" {...a11yProps(1)} />
        <Tab
          icon={<Widgets />}
          label="Apps y Servicios"
          {...a11yProps(2)}
        />
        <Tab icon={<Category />} label="Categorias" {...a11yProps(3)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <DashboardMaestro />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PackagesCourses />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Productos />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Categorias />
      </TabPanel>
    </div>
  );
}
