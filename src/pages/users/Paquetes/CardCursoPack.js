import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { formatoMexico } from "../../../config/reuserFunction";
import { withRouter } from "react-router-dom";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import { Fragment } from "react";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 130,
  },
}));

function CardCursoPack({ cursoObj }) {
  const classes = useStyles();
  const { course } = cursoObj;

  return (
    <Fragment>
      <Card variant="outlined">
        <CardMedia
          className={classes.media}
          alt={`imagen curso ${course._id}`}
          image={course.urlPromotionalImage}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" noWrap>
            {course.title}
          </Typography>
          <Box className={classes.masInfo}>
            <Box display="flex" alignItems="center" style={{ marginBottom: 2 }}>
              <AccessTimeIcon style={{ marginRight: 5 }} />
              <Typography>{`${course.hours} horas de curso`}</Typography>
            </Box>
            <Box display="flex" alignItems="center" style={{ marginBottom: 2 }}>
              <AssessmentOutlinedIcon style={{ marginRight: 5 }} />
              <Typography>{`Nivel ${course.level}`}</Typography>
            </Box>
          </Box>
        </CardContent>
        <CardActions>
          {cursoObj.prices.persentagePromotion !== "0" ? (
            <Grid container>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" color="textPrimary" align="right">
                  ${formatoMexico(cursoObj.prices.promotionPrice)} MXN
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" color="textSecondary" align="right">
                  <s>${formatoMexico(course.priceCourse.price)} MXN</s>
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="h6" color="textPrimary" align="right">
              ${formatoMexico(cursoObj.prices.price)} MXN
            </Typography>
          )}
        </CardActions>
      </Card>
    </Fragment>
  );
}

export default withRouter(CardCursoPack);
