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
  Button,
  Typography,
  Slide,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
  Card,
  CardContent,
  Modal,
  Box,
  Autocomplete,
  TextField,
  CardActions,
} from '@mui/material';
import ResponsiveAppBar from '../../layouts/Header';
import { addFoods, deleteFood, fetchFoods } from '../../redux/actions/foods';
import {
  fetchUserFoods,
  postFood,
  addFoodsToRender,
} from '../../redux/actions/user_foods';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { getFoodData } from '../../nutritionx/nutritionx_api_call';
import jwtDecode from 'jwt-decode';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { baseUrl } from '../../constants/base_url';
const mapStateToProps = (state) => {
  return {
    Foods: state.Foods,
    UserFoods: state.UserFoods,
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchFoods: () => dispatch(fetchFoods()),
  deleteFood: (foodId) => dispatch(deleteFood(foodId)),
  fetchUserFoods: () => dispatch(fetchUserFoods()),
  postFood: (food) => dispatch(postFood(food)),
  addFoods: (foods) => dispatch(addFoodsToRender(foods)),
  addAllFoods: (foods) => dispatch(addFoods(foods)),
});

const lastSevenDays = (foods, days) => {
  return foods.filter((food) => {
    const foodCreated = new Date(food.createdAt);
    const sevenDays = new Date(days * 8.64e7 - Date.now());
    console.log(foodCreated, sevenDays);
    return foodCreated > sevenDays;
  });
};

const sevenDaysBefore = (foods, days) => {
  return foods.filter((food) => {
    const foodCreated = new Date(food.createdAt);
    const sevenDays = new Date(days * 8.64e7 - Date.now());
    const fifteenDays = new Date(days * 1.21e9 - Date.now());
    console.log(foodCreated, sevenDays);
    return foodCreated > fifteenDays && foodCreated < sevenDays;
  });
};
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
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

const userDetailStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: '#FFF',
  border: '2px solid #000',
  p: 4,
};

function AdminHome(props) {
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

  const handleUpdate = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    console.log({
      name: data.get('update-food-name'),
      calorie: data.get('update-calorie'),
    });

    return fetch(baseUrl + 'foods/' + selectedFood._id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.get('update-food-name'),
        calorie: data.get('update-calorie'),
      }),
    })
      .then(
        (response) => {
          if (response.ok) {
            return response;
          } else {
            const error = new Error(
              'Error ' + response.status + ': ' + response.statusText
            );
            error.response = response;
            throw error;
          }
        },
        (error) => {
          throw error;
        }
      )
      .then((response) => response.json())
      .then((response) => {
        props.addAllFoods(response);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const decodedToken = props.auth.token
    ? jwtDecode(props.auth.token)
    : { treshold: 0 };
  console.log(decodedToken);

  // CHANGE THESE VALUE TO WHAT EVER YOU WANT LIKE THE COMMENT BELOW
  const DAILY_TRESHOLD = 2100;
  //const DAILY_TRESHOLD = decodedToken.treshold

  const foodsInRange = (foods, start, end) => {
    return foods.filter((food) => {
      const foodCreated = new Date(food.createdAt).getDate();
      //console.log(start, end)
      return foodCreated >= start.getDate() && foodCreated <= end.getDate();
    });
  };

  useEffect(() => {
    props.fetchFoods();
  }, []);

  useEffect(() => {
    props.fetchUserFoods();
    getFoodData()
      .then((result) => setOptions(result.hits))
      .catch((error) => setOptions([]));
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setValue(null);
  };
  const [options, setOptions] = useState([]);
  const [showTresholdError, setShowTresholdError] = useState(false);
  const [value, setValue] = useState(null);
  const [rangeValue, setRangeValue] = useState([null, null]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const todaysFoods = props.UserFoods.userFoods.filter((food) => {
    const foodCreated = new Date(food.createdAt);
    const today = new Date(Date.now());
    return foodCreated.getDay() === today.getDay();
  });

  let todaysCalories = 0;
  for (let food of todaysFoods) {
    todaysCalories += food.calorie;
  }

  const handleCloseDialog = () => {
    setDeleteDialog(false);
  };

  const handleCloseUserDetail = () => {
    setShowUserDetail(false);
  };

  let usersFoods,
    sevenDaysFoods,
    sevenDaysCalories,
    fifteenDaysFoods,
    fifteeenDayCalories;
  if (selectedUser) {
    usersFoods = props.Foods.foods.filter(
      (food) => food.user._id === selectedUser._id
    );
    sevenDaysFoods = lastSevenDays(usersFoods, 7);
    fifteenDaysFoods = sevenDaysBefore(usersFoods, 15);
    fifteeenDayCalories = 0;
    sevenDaysCalories = 0;
    for (let food of sevenDaysFoods) {
      sevenDaysCalories += food.calorie;
    }

    for (let food of fifteenDaysFoods) {
      fifteenDaysFoods += food.calorie;
    }
  }

  if (props.Foods.isLoading) {
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
  } else if (props.Foods.errorMessage) {
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
  } else if (props.Foods.foods.length >= 1) {
    const defaultProps = {
      options: options.map((option) => option.fields),
      getOptionLabel: (option) => option.item_name || option,
    };

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
        <Card sx={{ minWidth: 275, marginTop: 8, marginBottom: 8 }}>
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

        {selectedFood && (
          <>
            <Dialog
              open={deleteDialog}
              TransitionComponent={Transition}
              //keepMounted
              onClose={handleCloseDialog}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>{'Remove Item?'}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  Do you really want to remove this item?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>CANCEL</Button>
                <Button
                  onClick={() => {
                    props.deleteFood(selectedFood._id);
                    handleCloseDialog();
                  }}
                >
                  REMOVE
                </Button>
              </DialogActions>
            </Dialog>

            <Modal
              open={showUpdate}
              onClose={() => setShowUpdate(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={style}
                component="form"
                onSubmit={handleUpdate}
                noValidate
              >
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  gutterBottom
                >
                  Update Food
                </Typography>
                <Typography variant="body1">Food</Typography>
                <TextField
                  placeholder={selectedFood.name}
                  margin="normal"
                  required
                  fullWidth
                  id="update-food-name"
                  //label="Food"
                  name="update-food-name"
                  autoComplete="current-food"
                  autoFocus
                />
                <Typography variant="body1">Calorie</Typography>
                <TextField
                  placeholder={selectedFood.calorie}
                  margin="normal"
                  required
                  fullWidth
                  variant="outlined"
                  name="update-calorie"
                  type="number"
                  id="update-calorie"
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
                      Update
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      onClick={() => setShowUpdate(false)}
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      CLOSE
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </>
        )}

        <Grid container marginBottom="16px">
          <Grid item>
            <Typography variant="h5" color="text.primary">
              Food Entries Report
            </Typography>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Food</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Calories</TableCell>
                <TableCell>Date and Time</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.Foods.foods.map((food) => (
                <TableRow
                  key={food._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {food.name}
                  </TableCell>
                  <TableCell>{food.user.name}</TableCell>
                  <TableCell>{food.calorie}</TableCell>
                  <TableCell>
                    {new Date(food.createdAt).toUTCString()}
                  </TableCell>
                  <TableCell>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={4}>
                        <Button
                          onClick={() => {
                            setSelectedFood(food);
                            setShowUpdate(true);
                          }}
                          variant="contained"
                          color="primary"
                        >
                          Update
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          onClick={() => {
                            setSelectedFood(food);
                            setDeleteDialog(true);
                          }}
                          variant="contained"
                          color="secondary"
                        >
                          Delete
                        </Button>
                      </Grid>

                      <Grid item xs={4}>
                        <Button
                          onClick={() => {
                            setSelectedUser(food.user);
                            setShowUserDetail(true);
                          }}
                          variant="contained"
                          color="primary"
                        >
                          Details
                        </Button>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {selectedUser && (
          <Modal
            open={showUserDetail}
            onClose={handleCloseUserDetail}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={userDetailStyle}>
              <Grid container justifyContent="center" marginTop="16px">
                <Grid item>
                  <Typography variant="h5" color="text.primary">
                    {`2 Weeks Stats Details: ${selectedUser.name}`}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} justifyContent="center">
                <Grid item sm={6}>
                  <Card sx={{ minWidth: 275, marginTop: 8 }}>
                    <CardContent>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        {`Today: ${new Date(Date.now()).toUTCString()}`}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        Last 7 Days:
                      </Typography>
                      <Typography
                        sx={{ mb: 1.5 }}
                        variant="h5"
                        color="text.secondary"
                      >
                        {`Total Calories: ${sevenDaysCalories}`}
                      </Typography>
                      <Typography
                        sx={{ mb: 1.5 }}
                        variant="h5"
                        color="text.secondary"
                      >
                        {`Number of Entries: ${sevenDaysFoods.length}`}
                      </Typography>
                      <Typography variant="h5">
                        {`Average Daily Calories: ${parseInt(
                          sevenDaysCalories / 7
                        )}`}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item sm={6}>
                  <Card sx={{ minWidth: 275, marginTop: 8 }}>
                    <CardContent>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        {`Today: ${new Date(Date.now()).toUTCString()}`}
                      </Typography>
                      <Typography
                        variantsx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        7 Days Before:
                      </Typography>
                      <Typography
                        sx={{ mb: 1.5 }}
                        variant="h5"
                        color="text.secondary"
                      >
                        {`Total Calories: ${fifteeenDayCalories}`}
                      </Typography>
                      <Typography
                        sx={{ mb: 1.5 }}
                        variant="h5"
                        color="text.secondary"
                      >
                        {`Number of Entries: ${fifteenDaysFoods.length}`}
                      </Typography>
                      <Typography variant="h5">
                        {`Average Daily Calories: ${parseInt(
                          fifteeenDayCalories / 7
                        )}`}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid container justifyContent="end">
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      onClick={handleCloseUserDetail}
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      CLOSE
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        )}
      </Container>
    );
  } else {
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
                severity="info"
              >
                <AlertTitle style={{ fontWeight: 'bold' }}>Oops!</AlertTitle>
                <strong>No Food Entries Found!</strong>
              </Alert>
            </div>
          </div>
        </Container>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminHome);
