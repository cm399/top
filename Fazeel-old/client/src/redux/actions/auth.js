import * as actionTypes from '../action_types';

export const requestLogin = (creds) => {
  return {
    type: actionTypes.LOGIN_REQUEST,
    creds,
  };
};

export const receiveLogin = (response) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    token: response.token,
  };
};

export const loginError = (message) => {
  return {
    type: actionTypes.LOGIN_FAILURE,
    message,
  };
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  return {
    type: actionTypes.LOGOUT,
  };
};
export const loginUser = (creds, csrfToken) => (dispatch) => {
  dispatch(requestLogin(creds));
  return fetch('users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(creds),
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          const error = new Error(
            'Error ' + +response.status + ': ' + response.statusText
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
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('creds', JSON.stringify(creds));
        dispatch(receiveLogin(response));
      } else {
        const error = new Error(
          'Error ' + response.status + ': ' + response.statusText
        );
        error.response = response;
        throw error;
      }
    })
    .catch((error) => dispatch(loginError(error.message)));
};
