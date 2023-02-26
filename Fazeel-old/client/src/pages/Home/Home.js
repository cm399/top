import * as React from 'react';
import {
  Container,
  Alert,
  AlertTitle,
  CircularProgress,
  Table,
  TableCell,
  TableContainer,
  TableBody,
  TableHead,
  Paper,
  TableRow,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Modal,
  Box,
  TextField,
  Autocomplete,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import ResponsiveAppBar from '../../layouts/Header';
import {
  addFoodsToRender,
  fetchUserFoods,
  postFood,
} from '../../redux/actions/user_foods';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { getFoodData } from '../../nutritionx/nutritionx_api_call';
import jwtDecode from 'jwt-decode';

const mapStateToProps = (state) => {
  return {
    UserFoods: state.UserFoods,
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchUserFoods: () => dispatch(fetchUserFoods()),
  postFood: (food) => dispatch(postFood(food)),
  addFoods: (foods) => dispatch(addFoodsToRender(foods)),
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#FFF',
  border: '2px solid #000',
  p: 4,
};

const treshold = {
  0: 2100,
  1: 2100, // user 1
  2: 2200, // user 2
  3: 2100, // user 3
  4: 2100, // user 4
  5: 2100, // user 5
};

function Home(props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setValue(null);
  };
  const [options, setOptions] = useState([]);
  const [showTresholdError, setShowTresholdError] = useState(false);
  const [value, setValue] = useState(null);
  const [rangeValue, setRangeValue] = useState([null, null]);

  const todaysFoods = props.UserFoods.userFoods.filter((food) => {
    const foodCreated = new Date(food.createdAt);
    const today = new Date(Date.now());
    return foodCreated.getDay() === today.getDay();
  });

  let todaysCalories = 0;
  for (let food of todaysFoods) {
    todaysCalories += food.calorie;
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    console.log({
      name: data.get('food-name'),
      calorie: data.get('calorie'),
    });

    if (parseInt(data.get('calorie')) + todaysCalories > DAILY_TRESHOLD) {
      setShowTresholdError(true);
      return;
    }
    props.postFood({
      name: data.get('food-name'),
      calorie: data.get('calorie'),
    });
  };

  const decodedToken = props.auth.token
    ? jwtDecode(props.auth.token)
    : { treshold: 0 };
  console.log(decodedToken);

  // CHANGE THESE VALUE TO WHAT EVER YOU WANT LIKE THE COMMENT BELOW
  const DAILY_TRESHOLD = treshold[decodedToken?.limitId] || 2100;
  // const DAILY_TRESHOLD = decodedToken.treshold || 2100

  const foodsInRange = (foods, start, end) => {
    return foods.filter((food) => {
      const foodCreated = new Date(food.createdAt).getDate();
      //console.log(start, end)
      return foodCreated >= start.getDate() && foodCreated <= end.getDate();
    });
  };

  useEffect(() => {
    props.fetchUserFoods();
    getFoodData()
      .then((result) => setOptions(result.hits))
      .catch((error) => setOptions([]));
  }, []);

  if (props.UserFoods.isLoading) {
    return (
      <Container>
        <ResponsiveAppBar />
        <Container style={{ marginTop: '100px', backgroundColor: '#FCFAFB' }}>
          <div className="container">
            <div className="row">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '100px',
                  marginBottom: '75px',
                }}
              >
                <CircularProgress size={'50px'} />
              </div>
            </div>
          </div>
        </Container>
      </Container>
    );
  } else if (props.UserFoods.errorMessage) {
    return (
      <Container>
        <ResponsiveAppBar />
        <Container style={{ marginTop: '100px', backgroundColor: '#FCFAFB' }}>
          <div className="container">
            <div
              className="row"
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Alert
                style={{ margin: '50px', padding: '50px' }}
                severity="error"
              >
                <AlertTitle style={{ fontWeight: 'bold' }}>Error</AlertTitle>
                <strong>{props.UserFoods.errorMessage}</strong>
              </Alert>
            </div>
          </div>
        </Container>
      </Container>
    );
  } else if (props.UserFoods.userFoods) {
    const defaultProps = {
      options: options.map((option) => option.fields),
      getOptionLabel: (option) => option.item_name || option,
    };

    // this gives an object with dates as keys
    const groups = props.UserFoods.userFoods.reduce((groups, food) => {
      const date = food.createdAt.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(food.calorie);
      return groups;
    }, {});

    // Edit: to add it in the array format instead
    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        calories: groups[date],
      };
    });

    console.log(groupArrays);

    let reachedLimitDates = [];
    for (let date of groupArrays) {
      if (date.calories.reduce((a, b) => a + b) >= DAILY_TRESHOLD) {
        reachedLimitDates.push(date.date);
      }
    }

    console.log(reachedLimitDates);

    return (
      <Container>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} component="form" onSubmit={handleSubmit} noValidate>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Add Food
            </Typography>
            <Typography variant="body1">Food</Typography>
            <Autocomplete
              {...defaultProps}
              freeSolo
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  required
                  fullWidth
                  id="food-name"
                  //label="Food"
                  name="food-name"
                  autoComplete="current-food"
                  autoFocus
                />
              )}
            />
            <Typography variant="body1">Calorie</Typography>
            <TextField
              value={
                typeof value !== 'string' && value !== null
                  ? value.nf_calories
                  : null
              }
              margin="normal"
              required
              fullWidth
              hiddenLabel
              variant="outlined"
              name="calorie"
              type="number"
              id="calorie"
              autoComplete="current-calorie"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Add
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  onClick={handleClose}
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  CLOSE
                </Button>
              </Grid>
            </Grid>
            {showTresholdError === true ? (
              <Typography variant="body1">Above the daily Treshold</Typography>
            ) : null}
          </Box>
        </Modal>
        <ResponsiveAppBar />
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
              Today's Stats:
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {`Daily Treshold: ${DAILY_TRESHOLD}`}
            </Typography>
            <Typography variant="h5">
              {`Submitted: ${todaysCalories}`}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              disabled={todaysCalories >= DAILY_TRESHOLD}
              onClick={handleOpen}
              size="large"
            >
              {todaysCalories >= DAILY_TRESHOLD
                ? 'Daily Treshold Reached'
                : 'Add food'}
            </Button>
          </CardActions>
        </Card>
        {reachedLimitDates.length >= 1 && (
          <Card sx={{ minWidth: 275, mt: 8 }}>
            <CardContent>
              <Typography
                textAlign="start"
                sx={{ mb: 1.5 }}
                color="text.Primary"
              >
                You reached your daily treshold on:
                <List>
                  {reachedLimitDates.map((date) => (
                    <ListItem>
                      <ListItemText primary={date} />
                    </ListItem>
                  ))}
                </List>
              </Typography>
            </CardContent>
          </Card>
        )}
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
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Food</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Date and Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.UserFoods.foodsToRender.map((food) => (
                <TableRow
                  key={food.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left" component="th" scope="row">
                    {food.name}
                  </TableCell>
                  <TableCell align="right">{food.calorie}</TableCell>
                  <TableCell align="right">
                    {new Date(food.createdAt).toUTCString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  } else {
    const defaultProps = {
      options: options.map((option) => option.fields),
      getOptionLabel: (option) => option.item_name || option,
    };
    return (
      <Container>
        <ResponsiveAppBar />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} component="form" onSubmit={handleSubmit} noValidate>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Add Food
            </Typography>
            <Typography variant="body1">Food</Typography>
            <Autocomplete
              {...defaultProps}
              freeSolo
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  required
                  fullWidth
                  id="food-name"
                  //label="Food"
                  name="food-name"
                  autoComplete="current-food"
                  autoFocus
                />
              )}
            />
            <Typography variant="body1">Calorie</Typography>
            <TextField
              value={
                typeof value !== 'string' && value !== null
                  ? value.nf_calories
                  : null
              }
              margin="normal"
              required
              fullWidth
              hiddenLabel
              variant="outlined"
              name="calorie"
              type="number"
              id="calorie"
              autoComplete="current-calorie"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Add
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  onClick={handleClose}
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  CLOSE
                </Button>
              </Grid>
            </Grid>
            {showTresholdError === true ? (
              <Typography variant="body1">Above the daily Treshold</Typography>
            ) : null}
          </Box>
        </Modal>
        <Card sx={{ minWidth: 275, marginTop: 8 }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
              Today's Stats:
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {`Daily Treshold: ${DAILY_TRESHOLD}`}
            </Typography>
            <Typography variant="h5">
              {`Submitted: ${todaysCalories}`}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              disabled={todaysCalories >= DAILY_TRESHOLD}
              onClick={handleOpen}
              size="large"
            >
              {todaysCalories >= DAILY_TRESHOLD
                ? 'Daily Treshold Reached'
                : 'Add food'}
            </Button>
          </CardActions>
        </Card>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
