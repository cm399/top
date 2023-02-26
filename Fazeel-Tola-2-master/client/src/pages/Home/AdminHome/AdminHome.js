import * as React from 'react';
import { Container, Typography, Grid, Box, Divider } from '@mui/material';
import { addFoods, deleteFood, fetchFoods } from '../../../redux/actions/foods';
import { fetchUserFoods } from '../../../redux/actions/user_foods';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import Loader from '../common/Loader';
import ErrorAlert from '../common/ErrorAlert';
import FoodReportTable from '../common/FoodReportTable';
import AddFood from '../common/AddFood';
import NoItemAleart from './NoItemAleart';
import DeleteFood from './DeleteFood';
import UpdateFood from './UpdateFood';
import FoodDetailsTable from './FoodDetail';
import UpdateTreshold from './UpdateTreshold';
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
  addAllFoods: (foods) => dispatch(addFoods(foods)),
});

function AdminHome(props) {
  const [modal, setModal] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    props.fetchFoods();
    props.fetchUserFoods();
  }, []);

  const onClickUpdate = (value) => {
    setUserId(value?._id);
    setModal(true);
  };

  const getDetailsTable = () => {
    let foodUser = props.Foods?.foods
      ?.map((value) => value.user)
      .filter((value, index, arr) => arr.indexOf(value) === index);

    let userArray = [
      ...new Map(foodUser.map((item) => [item['_id'], item])).values(),
    ];

    return (
      <FoodDetailsTable
        userArray={userArray}
        allUserData={props.Foods?.foods}
        onClickUpdate={onClickUpdate}
      />
    );
  };

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);

  const handleCloseDialog = () => {
    setDeleteDialog(false);
  };

  if (props.Foods.isLoading) {
    return <Loader />;
  } else if (props.Foods.errorMessage) {
    return <ErrorAlert UserFoods={props.UserFoods.errorMessage} />;
  } else if (props.Foods.foods.length >= 1) {
    return (
      <Container>
        <AddFood ShowTresholdinfo={false} />
        <DeleteFood
          selectedFood={selectedFood}
          deleteDialog={deleteDialog}
          handleCloseDialog={handleCloseDialog}
          deleteFood={props.deleteFood}
        />
        {selectedFood && (
          <UpdateFood
            selectedFood={selectedFood}
            showUpdate={showUpdate}
            setShowUpdate={setShowUpdate}
            addAllFoods={props.addAllFoods}
          />
        )}

        <Grid container marginTop="32px" marginBottom="16px">
          <Grid item>
            <Typography variant="h5" color="text.primary">
              Food Entries Report
            </Typography>
          </Grid>
        </Grid>
        <FoodReportTable
          data={props.Foods.foods}
          showAction={true}
          onClickDelete={(food) => {
            setSelectedFood(food);
            setDeleteDialog(true);
          }}
          onClickUpdate={(food) => {
            setSelectedFood(food);
            setShowUpdate(true);
          }}
        />

        <Divider />
        <Box marginTop="30px" marginBottom="20px">
          {getDetailsTable()}
        </Box>
        <UpdateTreshold open={modal} updateModal={setModal} userId={userId} />
      </Container>
    );
  } else {
    return <NoItemAleart />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminHome);
