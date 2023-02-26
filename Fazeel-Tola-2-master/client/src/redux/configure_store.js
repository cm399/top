import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import { Auth } from './reducers/auth';
import { Signup } from './reducers/signup';
import { UserFoods } from './reducers/user_foods';
import { Foods } from './reducers/foods';

export const __store__ = () => {
  const store = createStore(
    combineReducers({
      // reducers here
      auth: Auth,
      Signup,
      UserFoods,
      Foods,
    }),
    applyMiddleware(thunk, logger)
  );

  return store;
};
