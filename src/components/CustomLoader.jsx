import React from "react";
import { Box, Typography } from "@material-ui/core";
import "./style.scss";
import ABIcon from "../Icons/ABIcon";

export default function CustomLoader({
  height = "50vh",
  text = "",
  color = "primary",
  size = 10,
}) {
  return (
    <div>
      <Box
        sx={{
          height,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <ABIcon
          color={color}
          size={size}
          className="waviy"
        />
        <Box sx={{ my: 1 }} />
        <Typography align="center">{text}</Typography>
      </Box>
    </div>
  );
}
