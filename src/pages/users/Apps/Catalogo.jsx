import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { WhatsApp } from "@material-ui/icons";
import { appsJson } from "./dataApps";
import { Container } from "@material-ui/core";

export default function CatalogoApps() {
  return (
    <Box my={3}>
      <Container maxWidth="md">
        <Grid container spacing={5}>
          {appsJson.map((res, index) => (
            <Grid item xs={12} key={index}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img
                      alt={res.title}
                      src={res.image}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        borderRadius: 7,
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box>
                    <Typography variant="h6">{res.title}</Typography>
                    <Typography align="justify">{res.description}</Typography>
                    <ul style={{ columns: 3 }}>
                      {res.points?.map((punto) => (
                        <li>
                          <Typography>{punto}</Typography>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="contained"
                      color="secondary"
                      disableElevation
                      href={`https://wa.me/5213173832252?text=Hola,%20quiero%20más%20información%20sobre%20esta%20app: ${res.title}`}
                      target="_blank"
                      style={{
                        backgroundColor: "#00a884",
                      }}
                      startIcon={<WhatsApp />}
                    >
                      Más información
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
