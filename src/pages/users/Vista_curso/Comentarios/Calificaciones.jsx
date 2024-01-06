import { makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import LinearProgress from "@material-ui/core/LinearProgress"
import Typography from "@material-ui/core/Typography"
import { Rating } from "@material-ui/lab";
import React from "react";
import clienteAxios from "../../../../config/axios";

const useStyles = makeStyles((theme) => ({
  sticky: {
    position: "sticky",
    top: theme.spacing(22),
    [theme.breakpoints.down("xs")]: {
      position: "inherit",
    }
  },
}));

function Calificaciones({ curso }) {
  const [calificacion, setCalificacion] = React.useState(null);
  const classes = useStyles();

  React.useLayoutEffect(() => {
    const getQualify = async () => {
      await clienteAxios
        .get(`/comment/qualification/get/${curso._id}`)
        .then((res) => {
          setCalificacion(res.data.commentCourse[0]);
        })
        .catch((err) => {
          console.log(err)
        });
    };
    getQualify();
  }, [curso._id]);

  if (!calificacion) {
    return null;
  }

  const { total, five, four, three, two, one } = calificacion;

  return (
    <Box mt={3} className={classes.sticky}>
      <Box display="flex" alignItems="center">
        <Typography variant="h3">
          {parseFloat(curso.qualification).toFixed(1)}
        </Typography>
        <Box ml={1}>
          <Rating
            name="read-only"
            value={curso.qualification}
            precision={0.5}
            readOnly
          />
          <Typography variant="body1">{`${total} Reseñas`}</Typography>
        </Box>
      </Box>

      <Grid container spacing={1} alignItems="center">
        <Grid item xs={1}>
          <Typography variant="body2" color="textSecondary">
            5
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={Math.round((five / total) * 100)}
          />
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            (five / total) * 100
          )}%`}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={1}>
          <Typography variant="body2" color="textSecondary">
            4
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={Math.round((four / total) * 100)}
          />
        </Grid>
        <Grid item xs={2} syle={{}}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            (four / total) * 100
          )}%`}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={1}>
          <Typography variant="body2" color="textSecondary">
            3
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={Math.round((three / total) * 100)}
          />
        </Grid>
        <Grid item xs={2} syle={{}}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            (three / total) * 100
          )}%`}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={1}>
          <Typography variant="body2" color="textSecondary">
            2
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={Math.round((two / total) * 100)}
          />
        </Grid>
        <Grid item xs={2} syle={{}}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            (two / total) * 100
          )}%`}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={1}>
          <Typography variant="body2" color="textSecondary">
            1
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={Math.round((one / total) * 100)}
          />
        </Grid>
        <Grid item xs={2} syle={{}}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            (one / total) * 100
          )}%`}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Calificaciones;
