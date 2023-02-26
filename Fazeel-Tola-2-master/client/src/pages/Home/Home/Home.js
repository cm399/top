import * as React from 'react';
import { Container, Typography, Box, TextField, Grid } from '@mui/material';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {
  addFoodsToRender,
  fetchUserFoods,
} from '../../../redux/actions/user_foods';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import Loader from '../common/Loader';
import ErrorAlert from '../common/ErrorAlert';
import AddFood from '../common/AddFood';
import FoodReportTable from '../common/FoodReportTable';
const mapStateToProps = (state) => {
  return {
    UserFoods: state.UserFoods,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchUserFoods: () => dispatch(fetchUserFoods()),
  addFoods: (foods) => dispatch(addFoodsToRender(foods)),
});

function Home(props) {
  const [rangeValue, setRangeValue] = useState([null, null]);

  const foodsInRange = (foods, start, end) => {
    return foods.filter((food) => {
      const foodCreated = new Date(food.createdAt).getDate();
      return foodCreated >= start.getDate() && foodCreated <= end.getDate();
    });
  };

  useEffect(() => {
    props.fetchUserFoods();
  }, []);

  if (props.UserFoods.isLoading) {
    return <Loader />;
  } else if (props.UserFoods.errorMessage) {
    return <ErrorAlert UserFoods={props.UserFoods.errorMessage} />;
  } else if (props.UserFoods.userFoods) {
    return (
      <Container>
        <AddFood ShowTresholdinfo={true} />
        <Grid container marginBottom="16px" marginTop="16px">
          <Grid item>
            <Typography variant="h5" color="text.primary">
              Food Entries Report
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          marginTop="16px"
          justifyContent="end"
          marginBottom="8px"
        >
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateRangePicker
                startText="From"
                endText="To"
                value={rangeValue}
                onAccept={(newValue) => {
                  props.addFoods(
                    foodsInRange(
                      props.UserFoods.userFoods,
                      newValue[0],
                      newValue[1]
                    )
                  );
                }}
                onChange={(newValue) => {
                  setRangeValue(newValue);
                }}
                renderInput={(startProps, endProps) => (
                  <React.Fragment>
                    <TextField {...startProps} />
                    <Box sx={{ mx: 2 }}> to </Box>
                    <TextField {...endProps} />
                  </React.Fragment>
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <FoodReportTable data={props?.UserFoods?.foodsToRender || []} />
      </Container>
    );
  } else {
    return <AddFood ShowTresholdinfo={true} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
