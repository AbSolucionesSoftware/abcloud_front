import React, { Fragment } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
/* import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox"; */
import CloseIcon from "@material-ui/icons/Close";
import { Divider } from "@material-ui/core";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";
import { PackageCtx } from "../PackagesCtx";

export default function ItemCourse({ course, index }) {
  const [temp, setTemp] = React.useState(0);
  const {packageObj, setPackage } = React.useContext(PackageCtx);

  const [INPUT] = useDebounce(temp, 800);

  const handleDeleteItem = () => {
    const courses = [...packageObj.courses];
    courses.splice(index, 1);
    let pricePack = 0;
    courses.forEach((res) => {
      pricePack += parseFloat(res.prices.promotionPrice);
    });
    const packObj = {
      ...packageObj,
      courses,
      pricePack,
    };
    setPackage(packObj);
  };

  /* const handleChangeFree = (free) => {
    const courses = [...packageObj.courses];
    const itemObj = { ...course, prices: { ...course.prices, free } };
    if (free) {
      itemObj.prices.promotionPrice = 0;
    } else {
      itemObj.prices.promotionPrice = itemObj.prices.price;
    }
    courses.splice(index, 1, itemObj);
    let pricePack = 0;
    courses.forEach((res) => {
      pricePack += parseFloat(res.prices.promotionPrice);
    });
    const packObj = {
      ...packageObj,
      courses,
      pricePack,
    };
    setPackage(packObj);
  }; */

  const getPrice = (value) => {
    //obtiene el porcentaje
    let percent = Math.round((value / course.course.priceCourse.price) * 100);
    let porcentaje = 100 - percent;
    const itemObj = { ...course };
    const courses = [...packageObj.courses];
    itemObj.prices.promotionPrice = value;
    itemObj.prices.persentagePromotion = porcentaje;
    courses.splice(index, 1, itemObj);
    setTemp(porcentaje);
    setPackage({
      ...packageObj,
      courses,
    });
  };

  const getPercent = (value) => {
    //obtiene el valor de descuento
    let porcentaje = 100 - value;
    let descuento = Math.round(
      (course.course.priceCourse.price * porcentaje) / 100
    );
    const itemObj = { ...course };
    const courses = [...packageObj.courses];
    itemObj.prices.promotionPrice = descuento;
    itemObj.prices.persentagePromotion = value;
    courses.splice(index, 1, itemObj);
    setTemp(descuento);
    setPackage({
      ...packageObj,
      courses,
    });
  };

  const calcularPrecios = () => {
    let pricePack = 0;
    [...packageObj.courses].forEach((res) => {
      pricePack += parseFloat(res.prices.promotionPrice);
    });
    const packObj = {
      ...packageObj,
      pricePack,
    };
    setPackage(packObj);
  };

  useEffect(() => {
    calcularPrecios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [INPUT]);

  return (
    <Fragment>
      <Box p={1}>
        <Grid container spacing={1}>
          <Grid item md={3}>
            <Avatar
              style={{ height: "100%", width: "100%" }}
              variant="square"
              alt="course-image"
              src={course.course.urlPromotionalImage}
            />
          </Grid>
          <Grid item md={9}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">{course.course.title}</Typography>
              <IconButton size="small" onClick={() => handleDeleteItem()}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box display="flex">
              {/* <FormControlLabel
                control={
                  <Checkbox
                    checked={course.prices.free}
                    onChange={(e) => handleChangeFree(e.target.checked)}
                    name="free"
                  />
                }
                label="Gratis"
              />
              <Box mx={1} /> */}
              <TextField
                size="small"
                variant="outlined"
                disabled={course.prices.free}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">%</InputAdornment>
                  ),
                }}
                type="number"
                onChange={(e) => getPercent(e.target.value)}
                value={course.prices.persentagePromotion}
              />
              <Box mx={1} />
              <TextField
                size="small"
                variant="outlined"
                disabled={course.prices.free}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                type="number"
                onChange={(e) => getPrice(e.target.value)}
                value={course.prices.promotionPrice}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Divider />
    </Fragment>
  );
}
