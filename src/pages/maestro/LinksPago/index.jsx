import React from "react";
import SearchFilter from "./SearchFilter";
import NuevoEnlacePago from "./NuevoLink/NuevoEnlacePago";
import { Grid } from "@material-ui/core";
import clienteAxios from "../../../config/axios";
import MessageSnackbar from "../../../components/Snackbar/snackbar";
import DialogResult from "./NuevoLink/DialogResult";
import TablePaysLink from "./TableLinks/TablePaysLink";

const initial_query = {
  data: undefined,
  loading: true,
  error: undefined,
};
const initial_response = {
  open: false,
  data: null,
  success: false,
};
const initial_snack = {
  open: false,
  mensaje: "",
  status: "",
};

export default function LinksPago() {
  const [filter, setFilter] = React.useState("");
  const limit = 20;
  const [page, setPage] = React.useState(1);
  const [query, setQuery] = React.useState(initial_query);
  const [update, setUpdate] = React.useState([]);
  const [response, setResponse] = React.useState(initial_response);
  const [snackbar, setSnackbar] = React.useState(initial_snack);
  let token = localStorage.getItem("token");

  const getPaymentLinks = React.useCallback(async () => {
    await clienteAxios
      .get(`/paymentlink?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setQuery((st) => ({
          ...st,
          loading: false,
          data: res.data.response,
        }));
      })
      .catch((error) => {
        console.log(error);
        setQuery((st) => ({
          ...st,
          loading: false,
          error,
        }));
        setSnackbar({
          open: true,
          mensaje: "Error: ocurrio algo inesperado",
          status: "error",
        });
      });
  }, [token, page]);

  React.useEffect(() => {
    getPaymentLinks();
  }, [getPaymentLinks, update]);

  return (
    <div>
      <MessageSnackbar
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        status={snackbar.status}
        setSnackbar={setSnackbar}
      />
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <SearchFilter filter={filter} setFilter={setFilter} />
        </Grid>
        <Grid
          item
          xs={6}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <NuevoEnlacePago
            setSnackbar={setSnackbar}
            setUpdate={setUpdate}
            setResponse={setResponse}
          />
        </Grid>
        <Grid item xs={12}>
          <TablePaysLink
            query={query}
            page={page}
            setPage={setPage}
            setSnackbar={setSnackbar}
          />
        </Grid>
      </Grid>
      <DialogResult response={response} setResponse={setResponse} setSnackbar={setSnackbar} />
    </div>
  );
}
