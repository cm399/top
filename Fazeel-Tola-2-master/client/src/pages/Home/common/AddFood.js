import {
  Container,
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

import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchUserFoods, postFood } from '../../../redux/actions/user_foods';
import { getFoodData } from '../../../nutritionx/nutritionx_api_call';
import ResponsiveAppBar from '../../../layouts/Header';
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
  1: 2200, // user 1
  2: 2200, // user 2
  3: 2100, // user 3
  4: 2100, // user 4
  5: 2100, // user 5
};

function AddFood(props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [calorie, setCarlorie] = useState(null);
  const [options, setOptions] = useState([]);
  const [showTresholdError, setShowTresholdError] = useState(false);

  useEffect(() => {
    getFoodData()
      .then((result) => setOptions(result.hits))
      .catch((error) => setOptions([]));
  }, []);
  const handleClose = () => {
    setOpen(false);
    setValue(null);
  };

  const decodedToken = props.auth.token
    ? jwtDecode(props.auth.token)
    : { treshold: 0 };
  console.log(decodedToken);

  // CHANGE THESE VALUE TO WHAT EVER YOU WANT LIKE THE COMMENT BELOW
  const DAILY_TRESHOLD = treshold[decodedToken?.limitId] || 2100;
  // const DAILY_TRESHOLD = decodedToken.treshold || 2100

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

    if (parseInt(data.get('calorie')) + todaysCalories > DAILY_TRESHOLD) {
      setShowTresholdError(true);
    }
    props.postFood({
      name: data.get('food-name'),
      calorie: data.get('calorie'),
    });

    setValue('');
  };

  const handleOpen = () => setOpen(true);

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

  let reachedLimitDates = [];
  for (let date of groupArrays) {
    if (date.calories.reduce((a, b) => a + b) >= DAILY_TRESHOLD) {
      reachedLimitDates.push(date.date);
    }
  }

  return (
    <Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style} component='form' onSubmit={handleSubmit} noValidate>
          <Typography
            id='modal-modal-title'
            variant='h6'
            component='h2'
            gutterBottom
          >
            Add Food
          </Typography>
          <Typography variant='body1'>Food</Typography>
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
                margin='normal'
                required
                fullWidth
                id='food-name'
                name='food-name'
                autoComplete='current-food'
                autoFocus
              />
            )}
          />
          <Typography variant='body1'>Calorie</Typography>
          <TextField
            value={
              typeof value !== 'string' && value !== null
                ? value.nf_calories
                : null
            }
            margin='normal'
            required
            fullWidth
            hiddenLabel
            variant='outlined'
            name='calorie'
            type='number'
            id='calorie'
            autoComplete='current-calorie'
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
              >
                Add
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                onClick={handleClose}
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
              >
                CLOSE
              </Button>
            </Grid>
          </Grid>
          {showTresholdError === true ? (
            <Typography variant='body1'>Above the daily Treshold</Typography>
          ) : null}
        </Box>
      </Modal>
      <ResponsiveAppBar />
      <Card sx={{ minWidth: 275 }}>
        {props.ShowTresholdinfo && (
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color='text.primary' gutterBottom>
              Today's Stats:
            </Typography>
            <Typography sx={{ mb: 1.5 }} color='text.secondary'>
              {`Daily Treshold: ${DAILY_TRESHOLD}`}
            </Typography>
            <Typography variant='h5'>{`Submitted: ${todaysCalories}`}</Typography>
          </CardContent>
        )}
        <CardActions>
          <Button onClick={handleOpen} size='large'>
            Add food
          </Button>
        </CardActions>
      </Card>
      {props.ShowTresholdinfo && reachedLimitDates.length >= 1 && (
        <Card sx={{ minWidth: 275, mt: 8 }}>
          <CardContent>
            <Typography textAlign='start' sx={{ mb: 1.5 }} color='text.Primary'>
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
    </Container>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AddFood);
