import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import {
  BottomNavigationAction,
  Box,
  CircularProgress,
  Collapse,
  styled,
  Typography,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import clienteAxios from "../../config/axios";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.action.disabled,
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

function CategoriasResponsive(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [categorias, setCategorias] = React.useState([]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const obtenerCategorias = async () => {
    setLoading(true);
    await clienteAxios
      .get("/categories/navbar")
      .then((res) => {
        setCategorias(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  React.useEffect(() => {
    obtenerCategorias();
  }, []);

  return (
    <div>
      <BottomNavigationAction
        icon={
          <Box onClick={() => toggleDrawer()}>
            <SubscriptionsIcon htmlColor="#fff" style={{ fontSize: 30 }} />
          </Box>
        }
      />
      <SwipeableDrawer anchor="bottom" open={open} onClose={() => toggleDrawer()} onOpen={() => toggleDrawer()}>
        <div className={classes.list}>
          <Puller />
          <Box display="flex" justifyContent="center" alignItems="center" pt={3}>
            <Typography variant="h6" align="center" color="textSecondary">
              Categorias
            </Typography>
          </Box>
          {loading ? (
            <Box display="flex" justifyContent="center" height="50vh" p={5}>
              <CircularProgress />
            </Box>
          ) : (
            <List style={{ height: "50vh" }}>
              {categorias.map((res, index) => (
                <ListCategories
                  key={index}
                  categorias={res}
                  toggleDrawer={toggleDrawer}
                  props={props}
                />
              ))}
            </List>
          )}
        </div>
      </SwipeableDrawer>
    </div>
  );
}

const ListCategories = ({ categorias, toggleDrawer, props }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Fragment>
      <ListItem button>
        <ListItemText
          onClick={() => {
            toggleDrawer();
            props.history.push(`search?category=${categorias.category}`);
          }}
          primary={
            <Typography variant="h6" noWrap>
              {categorias.category}
            </Typography>
          }
        />
        <IconButton onClick={handleClick}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {categorias.subcategories.map((subs, index) => (
            <ListItem key={index} button className={classes.nested}>
              <ListItemText
                primary={
                  <Typography variant="h6" noWrap>
                    {subs.subCategory}
                  </Typography>
                }
                onClick={() => {
                  toggleDrawer();
                  props.history.push(
                    `search?category=${categorias.category}&subcategory=${subs.subCategory}`
                  );
                }}
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Fragment>
  );
};

export default withRouter(CategoriasResponsive);
