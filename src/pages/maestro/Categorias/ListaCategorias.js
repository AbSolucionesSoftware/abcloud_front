import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import CrearSubCategoria from "./CrearSubcategorias";
import EditarCategoria from "./EditarCategoria";
import Editarsubcategoria from "./EditarSubcategoria";
import EliminarCategoria from "./EliminarCategoria";
import EliminarSubcategoria from "./EliminarSubcategoria";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

export default function ListaCategorias({ categorias, update, setUpdate }) {
  return (
    <TableContainer>
      <Typography variant="h6" gutterBottom component="div">
        Categorias
      </Typography>
      <Paper variant="outlined">
        <Table size="medium" aria-label="collapsible table">
          {/* <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>Categorias</TableCell>
            </TableRow>
          </TableHead> */}
          <TableBody>
            {categorias.map((row, index) => (
              <RenderCategorias
                key={index}
                categoria={row}
                update={update}
                setUpdate={setUpdate}
              />
            ))}
          </TableBody>
        </Table>
      </Paper>
    </TableContainer>
  );
}

const RenderCategorias = ({ categoria, update, setUpdate }) => {
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell padding="checkbox">
          <IconButton
            aria-label="expand row"
            size="medium"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant="button">{categoria.categorie}</Typography>
        </TableCell>
        <TableCell align="right" padding="checkbox">
          <EditarCategoria
            categoria={categoria}
            update={update}
            setUpdate={setUpdate}
          />
        </TableCell>
        <TableCell align="right" padding="checkbox">
          <EliminarCategoria
            categoria={categoria}
            update={update}
            setUpdate={setUpdate}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Typography
                variant="subtitle2"
                style={{ fontSize: 18 }}
                gutterBottom
                component="div"
              >
                Subcategorias
              </Typography>
              <Box my={1}>
                <CrearSubCategoria
                  categoria={categoria}
                  update={update}
                  setUpdate={setUpdate}
                />
              </Box>
              <Table size="medium" aria-label="purchases">
                <TableBody>
                  {categoria.subCategories.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell component="th" scope="row">
                        <Typography variant="button">
                          {row.subCategorie}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" padding="checkbox">
                        <Editarsubcategoria
                          categoria={categoria}
                          subcategoria={row}
                          update={update}
                          setUpdate={setUpdate}
                        />
                      </TableCell>
                      <TableCell align="right" padding="checkbox">
                        <EliminarSubcategoria
                          categoria={categoria}
                          subcategoria={row}
                          update={update}
                          setUpdate={setUpdate}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
