import * as actionTypes from '../action_types';

export const Auth = (
  state = {
    isLoading: false,
    isAuthenticated: localStorage.getItem('token') ? true : false,
    user: localStorage.getItem('creds')
      ? JSON.parse(localStorage.getItem('creds'))
      : null,
    errorMessage: null,
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
  },
  action
) => {
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        isAuthenticated: false,
        user: action.creds,
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        token: action.token,
        errorMessage: null,
      };
    case actionTypes.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        errorMessage: action.message,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        errorMessage: null,
        user: null,
        token: '',
      };
    default:
      return state;
  }
};
