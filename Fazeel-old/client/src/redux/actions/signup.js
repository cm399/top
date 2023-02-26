import * as actionTypes from '../action_types';

export const requestSignup = (profile) => {
  return {
    type: actionTypes.SIGNUP_REQUEST,
    profile,
  };
};

export const receiveSignup = (response) => {
  return {
    type: actionTypes.SIGNUP_SUCCESS,
    success: response.success,
  };
};

export const signupError = (message) => {
  return {
    type: actionTypes.SIGNUP_FAILURE,
    message: message,
  };
};
export const registerUser = (formData) => (dispatch) => {
  dispatch(requestSignup(formData));

  return fetch('users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
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
      if (response.success) {
        dispatch(receiveSignup(response));
      } else {
        const error = new Error('Error ' + response.status);
        error.response = response;
        throw error;
      }
    })
    .catch((error) => dispatch(signupError(error.message)));
};
