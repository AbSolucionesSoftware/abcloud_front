import React, { useCallback, useContext, useEffect } from "react";
import { Badge, BottomNavigationAction } from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { NavContext } from "../../context/context_nav";
import clienteAxios from "../../config/axios";

export default function CarritoNavbar({props, responsive }) {
  const { setCarrito, update, setMisCursos } = useContext(NavContext);
  let token = localStorage.getItem("token");
  const [ count, setCount] = React.useState(0);
  let user = { _id: "" };

  if (token !== null) user = JSON.parse(localStorage.getItem("student"));

  const obtenerCarritoBD = useCallback(async () => {
    if (!user._id) return;
    await clienteAxios
      .get(`/cart/${user._id}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setCarrito(res.data);
        let cant = res.data.courses.length;
        if(res.data.packsCourses && res.data.packsCourses.length) cant = cant + res.data.packsCourses.length;
        setCount(cant);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user._id, setCarrito]);

  const obtenerMisCursos = useCallback(async () => {
    if (!user._id) return;
    await clienteAxios
      .get(`/course/user/${user._id}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setMisCursos(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user._id, setMisCursos]);

  useEffect(() => {
    obtenerCarritoBD();
    obtenerMisCursos();
  }, [obtenerCarritoBD, obtenerMisCursos, update]);

  /* if (loading) {
		return (
			<Badge badgeContent={<CircularProgress color="inherit" size={12} />} color="secondary">
				<ShoppingCartIcon />
			</Badge>
		);
	} */

  return responsive ? (
    <BottomNavigationAction
      onClick={() => props.props.history.push("/carrito")}
      icon={
        <Badge
          badgeContent={count}
          color="secondary"
        >
          <ShoppingCartIcon htmlColor="#fff" style={{fontSize: 30}} />
        </Badge>
      }
    />
  ) : (
    <Badge
      badgeContent={count}
      color="secondary"
    >
      <ShoppingCartIcon fontSize="small" />
    </Badge>
  );
}
