import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import NewNotificationAdmin from "./NewNotificationAdmin";
import { DoneAll } from "@material-ui/icons";
import DeleteNotificationAdmin from "./DeleteNotificationAdmin";
import { Box, Tooltip, Typography } from "@material-ui/core";
import moment from "moment";
import EnviarNotificacionAdmin from "./SendTableAdmin";
/* import CreateNotificationAsModal from "./CreateNotiAsModal"; */
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import CreateNewModal from "./CreateModal/CreateNewModal";

export default function NotificationListAdmin({ notifications }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={100}>Imagen</TableCell>
            <TableCell>Titulo</TableCell>
            <TableCell>Descricion</TableCell>
            <TableCell>Url</TableCell>
            <TableCell>Creado</TableCell>
            <TableCell>Enviado</TableCell>
            <TableCell padding="checkbox">Modal</TableCell>
            <TableCell width={70}>estatus</TableCell>
            <TableCell padding="checkbox">Editar</TableCell>
            <TableCell padding="checkbox">Eliminar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notifications.map((data) => (
            <RenderNotificationList key={data._id} data={data} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const RenderNotificationList = ({ data }) => {
  const PatchTooltip = ({ children, ...props }) => (
    <Tooltip
      {...props}
      title={
        <Typography>
          {data.sended ? "Enviada" : "Guardada, Pulsa para enviar"}
        </Typography>
      }
    >
      <span>{children}</span>
    </Tooltip>
  );

  const creado = data.create_date
    ? moment().diff(data.create_date, "days")
    : "";
  const enviado = data.date_send ? moment().diff(data.date_send, "days") : "";

  return (
    <TableRow>
      <TableCell>
        {data.image ? (
          <Box
            height="50px"
            width="80px"
            display="flex"
            justifyContent="center"
          >
            <img
              alt={data.key_image}
              src={data.image}
              height="100%"
              width="100%"
            />
          </Box>
        ) : null}
      </TableCell>
      <TableCell>{data.title}</TableCell>
      <TableCell>{data.description}</TableCell>
      <TableCell>{data.url}</TableCell>
      <TableCell>
        {creado !== "" ? (creado > 0 ? `hace ${creado} días` : "hoy") : "-"}
      </TableCell>
      <TableCell>
        {enviado !== "" ? (enviado > 0 ? `hace ${enviado} días` : "hoy") : "-"}
      </TableCell>
      <TableCell align="center">
        {/* <CreateNotificationAsModal datos={data} /> */}
        {data.isModal ? (<InsertPhotoIcon color="action" />) : null}
      </TableCell>
      <TableCell align="center">
        <PatchTooltip>
          {data.sended ? (
            <DoneAll color="secondary" />
          ) : (
            <EnviarNotificacionAdmin datos={data} />
          )}
        </PatchTooltip>
      </TableCell>
      <TableCell align="center">
        {data.isModal ? <CreateNewModal datos={data} isEditing={true} /> : <NewNotificationAdmin datos={data} isEditing={true} />}
      </TableCell>
      <TableCell align="center">
        <DeleteNotificationAdmin datos={data} />
      </TableCell>
    </TableRow>
  );
};
