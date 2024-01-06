import React from "react";
import { Avatar, useTheme } from "@material-ui/core";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 14)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */
  return color;
}

export default function CustomAvatar({ size = 40, name = "", fontSize = 20 }) {
  const theme = useTheme();

  let children = "";
  if (!name) return <Avatar alt="sin foto de perfil" />;
  if (name.split(" ").length > 1) {
    children = `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`;
  } else {
    children = `${name.split(" ")[0][0]}`;
  }

  return (
    <Avatar
      style={{
        height: size,
        width: size,
        fontSize,
        backgroundColor: stringToColor(name),
        color: theme.palette.getContrastText(stringToColor(name)),
      }}
    >
      {children}
    </Avatar>
  );
}
