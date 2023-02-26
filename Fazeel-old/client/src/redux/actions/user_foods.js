import * as actionTypes from '../action_types';
import { baseUrl } from '../../constants/base_url';

export const userFoodsLoading = () => ({
  type: actionTypes.USER_FOODS_LOADING,
});

export const userFoodsFailed = (errmess) => ({
  type: actionTypes.USER_FOODS_FAILED,
  payload: errmess,
});

export const addUserFoods = (foods) => ({
  type: actionTypes.ADD_USER_FOODS,
  payload: foods,
});

export const addUserFoodItem = (food) => ({
  type: actionTypes.ADD_USER_FOOD_ITEM,
  payload: food,
});

export const addFoodsToRender = (foods) => ({
  type: actionTypes.ADD_FOODS_TO_RENDER,
  payload: foods,
});

export const fetchUserFoods = () => (dispatch) => {
  dispatch(userFoodsLoading(true));
  return fetch(baseUrl + 'foodsbyuser')
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
        const errMess = new Error(error.message);
        throw errMess;
      }
    )
    .then((response) => response.json())
    .then((foods) => {
      dispatch(addUserFoods(foods));
      dispatch(addFoodsToRender(foods));
    })
    .catch((error) => dispatch(userFoodsFailed(error.message)));
};

export const postFood = (formData) => (dispatch) => {
  return fetch(baseUrl + 'foods', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
    },
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
        const errMess = new Error(error.message);
        throw errMess;
      }
    )
    .then((response) => response.json())
    .then((response) => dispatch(addUserFoodItem(response)))
    .catch((error) => alert('CAUSE COULD NOT BE POSTED: ' + error));
};
