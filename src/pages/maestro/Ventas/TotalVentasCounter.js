import React from "react";
import { Paper, Box, Typography } from "@material-ui/core";
import CountUp from "react-countup";

export default function TotalVentasCounter({ counterGraphics }) {
  return (
    <Paper elevation={3}>
      <Box height={150}>
        <Typography variant="h6" align="center">
          Total de ventas concretadas
        </Typography>
        <Typography variant="h1" align="center">
          <CountUp
            end={
              counterGraphics.totalPaysSuccess.length
                ? counterGraphics.totalPaysSuccess[0].count
                : 0
            }
            duration={1}
          />
        </Typography>
      </Box>
    </Paper>
  );
}
