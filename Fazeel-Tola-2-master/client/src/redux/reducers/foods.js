import * as actionTypes from '../action_types';

export const Foods = (
  state = {
    isLoading: true,
    errorMessage: null,
    foods: [],
  },
  action
) => {
  switch (action.type) {
    case actionTypes.FOODS_LOADING:
      return {
        ...state,
        isLoading: true,
        errorMessage: null,
        foods: [],
      };
    case actionTypes.ADD_FOODS:
      return {
        ...state,
        isLoading: false,
        errorMessage: null,
        foods: action.payload,
      };
    case actionTypes.FOODS_FAILED:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload,
        foods: [],
      };
    case actionTypes.ADD_FOOD_ITEM:
      return {
        ...state,
        isLoading: false,
        errorMessage: null,
        foods: state.foods.concat(action.payload),
      };
    default:
      return state;
  }
};
