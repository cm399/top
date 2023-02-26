import * as actionTypes from '../action_types';

export const Signup = (
  state = {
    isLoading: false,
    errorMessage: null,
    success: false,
    profile: null,
  },
  action
) => {
  switch (action.type) {
    case actionTypes.SIGNUP_REQUEST:
      return {
        ...state,
        isLoading: true,
        profile: action.profile,
        success: false,
      };
    case actionTypes.SIGNUP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: true,
        errorMessage: null,
        profile: null,
      };
    case actionTypes.SIGNUP_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.message,
        success: false,
      };
    default:
      return state;
  }
};
