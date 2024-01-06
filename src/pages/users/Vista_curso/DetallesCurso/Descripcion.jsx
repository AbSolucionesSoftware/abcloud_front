import React from "react";
import { Box, Typography } from "@material-ui/core";
import DOMPurify from "dompurify";

export default function Descripcion({ curso }) {
  return (
    <>
      <Box textAlign="justify" id="descripcion" style={{scrollMarginTop: "12em"}}>
        <Typography variant="h6">Descripción del curso</Typography>
        <Typography
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(curso.course.description),
          }}
        />
      </Box>
    </>
  );
}
