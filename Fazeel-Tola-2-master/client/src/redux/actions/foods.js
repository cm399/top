import * as actionTypes from '../action_types';
import { baseUrl } from '../../constants/base_url';

export const foodsLoading = () => ({
  type: actionTypes.FOODS_LOADING,
});

export const foodsFailed = (errmess) => ({
  type: actionTypes.FOODS_FAILED,
  payload: errmess,
});

export const addFoods = (foods) => ({
  type: actionTypes.ADD_FOODS,
  payload: foods,
});

export const fetchFoods = () => (dispatch) => {
  dispatch(foodsLoading(true));
  return fetch(baseUrl + 'foods')
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
    .then((foods) => dispatch(addFoods(foods)))
    .catch((error) => dispatch(foodsFailed(error.message)));
};

export const deleteFood = (foodId) => (dispatch) => {
  return fetch(baseUrl + 'foods/' + foodId, {
    method: 'DELETE',
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
    .then((response) => dispatch(addFoods(response)))
    .catch((error) => dispatch(foodsFailed(error)));
};
