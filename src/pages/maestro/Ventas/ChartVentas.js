import React from "react";
import { Paper, Box, Typography, Grid } from "@material-ui/core";
import { PieChart, Pie, Cell } from "recharts";
import CountUp from "react-countup";

const COLORS = ["#3b7bbf", "#635BFF", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function VentasMaestro({ counterGraphics }) {
  const data = [
    {
      name: "paypal",
      value: counterGraphics.paypalPays.length
        ? counterGraphics.paypalPays[0].count
        : 0,
    },
    {
      name: "stripe",
      value: counterGraphics.stripePays.length
        ? counterGraphics.stripePays[0].count
        : 0,
    },
    {
      name: "failed",
      value: counterGraphics.failedsPays ? counterGraphics.failedsPays : 0,
    },
  ];

  return (
    <Paper elevation={3}>
      <Grid container alignItems="center">
        <Grid
          item
          sm={4}
          xs={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <PieChart width={150} height={150}>
            <Pie
              data={data}
              cx={70}
              cy={70}
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={65}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </Grid>
        <Grid
          item
          sm={8}
          xs={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Box display="flex" alignItems="center">
            <Box>
              <Box display="flex" my={2}>
                <Box height={25} width={25} bgcolor="#3b7bbf" />
                <Box mx={1} />
                <Typography>
                  Ventas en Paypal{" "}
                  <b>
                    (
                    {
                      <CountUp
                        end={
                          counterGraphics.paypalPays.length
                            ? counterGraphics.paypalPays[0].count
                            : 0
                        }
                        duration={0.5}
                      />
                    }
                    )
                  </b>
                </Typography>
              </Box>
              <Box display="flex" my={2}>
                <Box height={25} width={25} bgcolor="#635BFF" />
                <Box mx={1} />
                <Typography>
                  Ventas en Stripe{" "}
                  <b>
                    (
                    {
                      <CountUp
                        end={
                          counterGraphics.stripePays.length
                            ? counterGraphics.stripePays[0].count
                            : 0
                        }
                        duration={1}
                      />
                    }
                    )
                  </b>
                </Typography>
              </Box>
              <Box display="flex" my={2}>
                <Box height={25} width={25} bgcolor="#FF8042" />
                <Box mx={1} />
                <Typography>
                  Pagos Fallidos{" "}
                  <b>
                    (
                    {
                      <CountUp
                        end={
                          counterGraphics.failedsPays
                            ? counterGraphics.failedsPays
                            : 0
                        }
                        duration={1.5}
                      />
                    }
                    )
                  </b>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
