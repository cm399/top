import * as actionTypes from '../action_types';

export const UserFoods = (
  state = {
    isLoading: true,
    errorMessage: null,
    userFoods: [],
    foodsToRender: [],
  },
  action
) => {
  switch (action.type) {
    case actionTypes.USER_FOODS_LOADING:
      return {
        ...state,
        isLoading: true,
        errorMessage: null,
        userFoods: [],
      };
    case actionTypes.ADD_USER_FOODS:
      return {
        ...state,
        isLoading: false,
        errorMessage: null,
        userFoods: action.payload,
      };
    case actionTypes.USER_FOODS_FAILED:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload,
        userFoods: [],
      };
    case actionTypes.ADD_USER_FOOD_ITEM:
      return {
        ...state,
        isLoading: false,
        errorMessage: null,
        userFoods: state.userFoods.concat(action.payload),
        foodsToRender: state.foodsToRender.concat(action.payload),
      };
    case actionTypes.ADD_FOODS_TO_RENDER:
      return {
        ...state,
        foodsToRender: action.payload,
      };
    default:
      return state;
  }
};
