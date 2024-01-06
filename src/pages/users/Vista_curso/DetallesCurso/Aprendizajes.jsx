import React from "react";
import { Box, Divider, Typography } from "@material-ui/core";

export default function Aprendizajes({ curso }) {
  return (
    <>
      <Box id="aprendizaje" style={{scrollMarginTop: "12em"}}>
        <Box mb={2}>
          <Typography variant="h6">Aprendizajes</Typography>
          <Divider />
        </Box>
        <Box pl={1}>
          <Typography style={{fontWeight: 500}}>Requisitos</Typography>
          <Box>
            <ul>
              {curso.course.requirements.map((res) => {
                return (
                  <li key={res._id}>
                    <Typography>{res.requirement}</Typography>
                  </li>
                );
              })}
            </ul>
          </Box>
          <Typography style={{fontWeight: 500}}>¿Qué aprenderás?</Typography>
          <Box>
            <ul>
              {curso.course.learnings.map((res) => {
                return (
                  <li key={res._id}>
                    <Typography>{res.learning}</Typography>
                  </li>
                );
              })}
            </ul>
          </Box>
          <Typography style={{fontWeight: 500}}>¿Para quién es este curso?</Typography>
          <Box>
            <ul>
              {curso.course.whoStudents.map((res) => {
                return (
                  <li key={res._id}>
                    <Typography>{res.whoStudent}</Typography>
                  </li>
                );
              })}
            </ul>
          </Box>
        </Box>
      </Box>
    </>
  );
}
