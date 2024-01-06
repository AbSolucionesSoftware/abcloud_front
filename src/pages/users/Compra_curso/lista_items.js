import React from "react";
import { Box, makeStyles, Grid, Typography, Divider } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import LinkMaterial from "@material-ui/core/Link";
import { formatoMexico } from "../../../config/reuserFunction";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  imagen: {
    maxHeight: "100%",
    maxWidth: "100%",
  },
  buttons: {
    display: "block",
  },
  grid: {
    backgroundColor: theme.palette.background.paper,
  },
}));

function ListaCompra(props) {
  const classes = useStyles();
  const { curso, curso_data } = props;

  const PrecioRender = () => {
    if (curso.priceCourse.free) {
      return (
        <Typography variant="h6" color="textPrimary">
          ¡Gratis!
        </Typography>
      );
    } else if (curso_data.pack){
      if(curso_data.persentagePromotion !== "0"){
        return (
          <Box>
            <Typography variant="h6" align="right" color="textPrimary">
              {formatoMexico(curso_data.pricePromotionCourse)} MXN$
            </Typography>
            <Typography variant="subtitle1" align="right" color="textSecondary">
              <s>{formatoMexico(curso_data.priceCourse)} MXN$</s>
            </Typography>
          </Box>
        );
      }else{
        return (
          <Box>
            <Typography variant="h6" align="right" color="textPrimary">
              {formatoMexico(curso_data.pricePromotionCourse)} MXN$
            </Typography>
          </Box>
        );
      }
    } else if (
      curso_data.coupon_discount &&
      curso_data.coupon_discount.coupon_code
    ) {
      return (
        <Box>
          <Typography variant="h6" align="right" color="textPrimary">
            {formatoMexico(curso_data.pricePromotionCourse)} MXN$
          </Typography>
          <Typography variant="subtitle1" align="right" color="textSecondary">
            <s>{formatoMexico(curso_data.priceCourse)} MXN$</s>
          </Typography>
        </Box>
      );
    } else if (curso.priceCourse.promotionPrice) {
      return (
        <Box>
          <Typography variant="h6" align="right" color="textPrimary">
            {formatoMexico(curso.priceCourse.promotionPrice)} MXN$
          </Typography>
          <Typography variant="subtitle1" align="right" color="textSecondary">
            <s>{formatoMexico(curso.priceCourse.price)} MXN$</s>
          </Typography>
        </Box>
      );
    } else {
      return (
        <Typography variant="h6" color="textPrimary" align="right">
          {formatoMexico(curso.priceCourse.price)} MXN$
        </Typography>
      );
    }
  };

  return (
    <Box my={5}>
      <Box my={3} className={classes.grid}>
        <Grid container spacing={2}>
          <Grid item lg={3} sm={3} xs={12}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <img
                alt="imagen carrito"
                src={curso.urlPromotionalImage}
                className={classes.imagen}
              />
            </Box>
          </Grid>
          <Grid item lg={6} sm={6} xs={12}>
            <Box>
              <LinkMaterial
                href={`/curso/${curso.slug}`}
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="none"
              >
                <Typography variant="h5">{curso.title}</Typography>
              </LinkMaterial>
              <Typography variant="subtitle1" color="textSecondary">
                {`Por ${curso.idProfessor.name}`}
                {curso.idProfessor.profession
                  ? `, ${curso.idProfessor.profession}`
                  : ""}
              </Typography>
            </Box>
            {curso_data.coupon_discount ? (
              <Alert
                severity="success"
                icon={false}
                style={{ justifyContent: "center", padding: 0 }}
              >
                <AlertTitle>{`${curso_data.persentagePromotion}% de descuento aplicado con el cupón: ${curso_data.coupon_discount.coupon_code} `}</AlertTitle>
                {curso_data.both_promotion ? (
                  <strong>{`Este curso ya tenia un ${curso_data.course.priceCourse.persentagePromotion}% de descuento, el descuento del cupón se aplicará sobre este descuento`}</strong>
                ) : null}
              </Alert>
            ) : curso_data.persentagePromotion !== "0" ? (
              <Alert
                severity="info"
                icon={false}
                style={{ justifyContent: "center", padding: 0 }}
              >
                Curso en promoción
              </Alert>
            ) : null}
          </Grid>
          <Grid item lg={3} sm={3} xs={12}>
            <Box height="100%">
              <Box display="flex" justifyContent="flex-end">
                <PrecioRender />
                {/* {curso.priceCourse.free ? (
                <Typography variant="h6" color="textPrimary">
                  ¡Gratis!
                </Typography>
              ) : curso.priceCourse.promotionPrice ? (
                <Box>
                  <Typography variant="h6" align="right" color="textPrimary">
                    {formatoMexico(curso.priceCourse.promotionPrice)} MXN$
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    align="right"
                    color="textSecondary"
                  >
                    <s>{formatoMexico(curso.priceCourse.price)} MXN$</s>
                  </Typography>
                </Box>
              ) : (
                <Typography variant="h6" color="textPrimary" align="right">
                  {formatoMexico(curso.priceCourse.price)} MXN$
                </Typography>
              )} */}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Divider />
    </Box>
  );
}

export default withRouter(ListaCompra);
