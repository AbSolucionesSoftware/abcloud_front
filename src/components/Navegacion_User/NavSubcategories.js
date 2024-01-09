import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import clienteAxios from "../../config/axios";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
  },
  paper: {
    backgroundColor: 'rgb(69, 57, 82)',
    width: "100%",
    /* marginLeft: theme.spacing(0.7), */
    borderRadius: 0,
    marginLeft: 0,
    transition:
      "opacity 201ms cubic-bezier(0.0, 0, 0.0, 1) 0ms, transform 134ms cubic-bezier(0.0, 0, 0.0, 1) 0ms",
  },
  subcategories: {
    color: 'white', //theme.palette.primary.main,
    padding: "3px"
  },
  test: {
    width: "100%",
    transform: "translate3d(0px, 80px, 0px)!important",
  },
}));

export default function CategoriasContainer() {
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);

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

  useEffect(() => {
    obtenerCategorias();
  }, []);

  if (loading) {
    return <Box width="100%" height={34} />;
  }

  return (
    <Box display="flex" width="100%">
      {categorias.map((category, index) => {
        return <RenderCategorias key={index} category={category} />;
      })}
    </Box>
  );
}

const RenderCategorias = ({ category }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen(true);
  };

  const handleClose = (event) => {
    setOpen(false);
  };

  return (
    <Box>
      <Button
        style={{ textTransform: "none", padding: "4px 16px" }}
        ref={anchorRef}
        component={Link}
        to={`search?category=${category.category}`}
        aria-haspopup="true"
        onMouseOver={handleToggle}
        color="primary"
        onMouseLeave={handleClose}
        categoria={category.category}
      >
        {category.category}
      </Button>
      <Popper
        className={classes.test}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        onMouseOver={handleToggle}
        onMouseLeave={handleClose}
      >
        {({ TransitionProps, placement }) => (
          <Grow {...TransitionProps}>
            <Paper className={classes.paper}>
              <ClickAwayListener onClickAway={handleClose}>
                <Box display="flex" justifyContent="center">
                  {category.subcategories.map((subcat, index) => {
                    return (
                      <Box key={index} mx={1}>
                        <Button
                          variant="text"
                          className={classes.subcategories}
                          style={{ textTransform: "none" }}
                          component={Link}
                          to={`search?category=${category.category}&subcategory=${subcat.subCategory}`}
                        >
                          {subcat.subCategory}
                        </Button>
                      </Box>
                    );
                  })}
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};
