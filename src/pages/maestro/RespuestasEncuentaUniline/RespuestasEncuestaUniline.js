import React, { useState, useEffect } from "react";
import SearchIcon from "@material-ui/icons/Search";
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import TablaUser from "./TablaUser";
import clienteAxios from "../../../config/axios";
import ExportExcelAnswersUsers from "./ExportExcelAnswersUsers";
import { useDebounce } from "use-debounce";

export default function RespuestasEncuestaUniline(props) {
  const [users, setUsers] = useState([]);
  const [text, setText] = useState("");
  const [value] = useDebounce(text, 800);

  let user;
  const token = localStorage.getItem("token");
  if (token !== null) user = JSON.parse(localStorage.getItem("student"));

  const handleChangeSearch = (e) => setText(e.target.value);

  useEffect(() => {
    const getUsersAnswers = async (value2) => {
      try {
        const data = await clienteAxios.get(
          `/question/user/answers/all?search=${!value2 ? "" : value2}`,
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        );
        setUsers(data.data);
      } catch (error) {
        
      }
    };
    getUsersAnswers(value);
  }, [value,token]);

  if (!token || !user) {
    props.history.push("/");
  }

  return (
    <Box>
      <Grid container>
        <Grid item md={6}>
          <form id="student-search" /* onSubmit={submitSearch} */>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              onChange={handleChangeSearch}
              placeholder="Busca un estudiante por nombre, email o número"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" size="small">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </Grid>
        <Grid
          item
          md={6}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Box>
            <ExportExcelAnswersUsers users={users} />
          </Box>
        </Grid>
      </Grid>
      <Box my={2}>
        <TablaUser users={users} />
      </Box>
    </Box>
  );
}
