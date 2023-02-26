import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import DaysReport from './DaysReport';

const FoodDetailsTable = ({ allUserData, userArray, onClickUpdate }) => {
  let sevenDaysFoods,
    sevenDaysCalories,
    fifteenDaysFoods,
    fifteeenDayCalories,
    todaysCalories,
    todaysFoods;

  const lastSevenDays = (foods, days) => {
    return foods.filter((food) => {
      const foodCreated = new Date(food.createdAt);
      const sevenDays = new Date(days * 8.64e7 - Date.now());
      return foodCreated > sevenDays;
    });
  };

  const sevenDaysBefore = (foods, days) => {
    return foods.filter((food) => {
      const foodCreated = new Date(food.createdAt);
      const sevenDays = new Date(days * 8.64e7 - Date.now());
      const fifteenDays = new Date(days * 1.21e9 - Date.now());
      return foodCreated > fifteenDays && foodCreated < sevenDays;
    });
  };

  const TodaysFood = (foods) => {
    return foods.filter((food) => {
      const foodCreated = new Date(food.createdAt);
      const today = new Date(Date.now());
      return foodCreated.getDay() === today.getDay();
    });
  };

  const foodDetailsFilter = (foodDetails) => {
    const usersFoods = allUserData.filter(
      (food) => food.user._id === foodDetails._id
    );

    sevenDaysFoods = lastSevenDays(usersFoods, 7);
    fifteenDaysFoods = sevenDaysBefore(usersFoods, 15);
    todaysFoods = TodaysFood(usersFoods);

    fifteeenDayCalories = 0;
    sevenDaysCalories = 0;
    todaysCalories = 0;

    console.log(TodaysFood(usersFoods));

    todaysFoods.forEach((i) => (todaysCalories += i.calorie));
    sevenDaysFoods.forEach((i) => (sevenDaysCalories += i.calorie));
    fifteenDaysFoods.forEach((i) => (fifteenDaysFoods += i.calorie));
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="left">No</TableCell>
            <TableCell align="center">User</TableCell>
            <TableCell align="left" colSpan="3" rowSpan="3">
              The Last 7 Days({`Today: ${new Date(Date.now()).toUTCString()}`})
              <TableCell align="right">Number of Entries</TableCell>
              <TableCell align="right">Average Daily Calories</TableCell>
            </TableCell>
            <TableCell align="left" colSpan="3" rowSpan="3">
              The Week Before({`Today: ${new Date(Date.now()).toUTCString()}`})
              <TableCell align="right">Number of Entries</TableCell>
              <TableCell align="right">Average Daily Calories</TableCell>
            </TableCell>
            {/* <TableCell align="center" colSpan="2" rowSpan="3">
              Actions
            </TableCell> */}
          </TableRow>
        </TableHead>
        {userArray.map((foodDetails, index) => {
          foodDetailsFilter(foodDetails);
          return (
            <TableBody key={index}>
              <TableRow>
                <TableCell align="center" component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  {foodDetails.name}
                </TableCell>
                <DaysReport
                  calories={sevenDaysCalories}
                  totalDays={sevenDaysFoods.length}
                />
                <TableCell align="left" component="th" scope="row"></TableCell>
                <DaysReport
                  calories={fifteeenDayCalories}
                  totalDays={fifteenDaysFoods.length}
                />
                <TableCell></TableCell>
                {/* <TableCell align="right" component="th" scope="row">
                  <Box>
                    <Button
                      onClick={() => {
                        onClickUpdate(foodDetails);
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Update
                    </Button>
                  </Box>
                </TableCell> */}
              </TableRow>
            </TableBody>
          );
        })}
      </Table>
    </TableContainer>
  );
};

export default FoodDetailsTable;
