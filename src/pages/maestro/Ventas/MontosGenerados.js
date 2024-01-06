import React from "react";
import { Paper, Box, Typography, Grid } from "@material-ui/core";
import CountUp from "react-countup";
import { formatoMexico } from "../../../config/reuserFunction";

export default function MontosGenerados({ counterGraphics }) {
  return (
    <Paper elevation={3}>
      <Box minHeight={150} width="100%">
        <Typography variant="h6" align="center">
          Dinero generado
        </Typography>
        <Grid
          container
          style={{
            minHeight: "100px",
            alignItems: "center",
          }}
        >
          <Grid
            item
            sm={4}
            xs={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Box>
              <Typography variant="h6">Paypal</Typography>
              <Typography variant="h5">
                $
                <CountUp
                  end={
                    counterGraphics.paypalPays.length
                      ? counterGraphics.paypalPays[0].total
                      : 0
                  }
                  duration={1}
                  formattingFn={(value) => formatoMexico(value)}
                />
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            sm={4}
            xs={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Box>
              <Typography variant="h6">Stripe</Typography>
              <Typography variant="h5">
                $
                <CountUp
                  end={
                    counterGraphics.stripePays.length
                      ? counterGraphics.stripePays[0].total
                      : 0
                  }
                  duration={1}
                  formattingFn={(value) => formatoMexico(value)}
                />
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            sm={4}
            xs={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Box>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h5">
                $
                <CountUp
                  end={
                    counterGraphics.totalPaysSuccess.length
                      ? counterGraphics.totalPaysSuccess[0].total
                      : 0
                  }
                  duration={1}
                  formattingFn={(value) => formatoMexico(value)}
                />
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
