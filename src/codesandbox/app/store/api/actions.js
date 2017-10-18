// @flow
import { values } from 'lodash';

import sendError from 'codesandbox/app/utils/error';
import notificationActions from '../notifications/actions';
import apiRequest from '../services/api';
import responses from '../services/apiMock';
import type { BodyType } from '../services/api';

import { jwtSelector } from '../user/selectors';

type APIActions = {
  REQUEST: string,
  SUCCESS: string,
  FAILURE: string,
};

export function createAPIActions(prefix: string, suffix: string): APIActions {
  const PREFIX = prefix.toUpperCase();
  const SUFFIX = suffix.toUpperCase();
  return {
    REQUEST: `${PREFIX}/${SUFFIX}_REQUEST`,
    SUCCESS: `${PREFIX}/${SUFFIX}_SUCCESS`,
    FAILURE: `${PREFIX}/${SUFFIX}_FAILURE`,
  };
}

const getMessage = (error: Error & { response: ?Object }) => {
  const response = error.response;

  if (!response || response.status >= 500) {
    sendError(error);
  }

  if (response && response.data && response.data.errors) {
    const errors = values(response.data.errors)[0];
    if (Array.isArray(errors)) {
      if (errors[0]) {
        error.message = errors[0]; // eslint-disable-line no-param-reassign
      }
    } else {
      error.message = errors; // eslint-disable-line no-param-reassign
    }

    if (response.data.error) {
      error.message = response.data.error; // eslint-disable-line no-param-reassign
    }
  }

  return error.message;
};

const showError = error => dispatch => {
  const errorMessage = getMessage(error);
  dispatch(notificationActions.addNotification(errorMessage, 'error'));
  error.apiMessage = errorMessage; // eslint-disable-line no-param-reassign
};

export function doRequest(
  actions: APIActions,
  endpoint: string,
  body?: BodyTypef
) {
  return async (dispatch: Function, getState: Function) => {
    const jwt = jwtSelector(getState());
    dispatch({
      type: actions.REQUEST,
      endpoint,
      body,
      jwt,
      meta: body ? body.body : null,
    });

    try {
      const data = process.env.NODE_ENV !== 'production' ? responses[actions.REQUEST] : await apiRequest(endpoint, jwt, body);

      dispatch({
        type: actions.SUCCESS,
        data,
        meta: body ? body.body : null,
      });

      return data;
    } catch (error) {
      dispatch({
        type: actions.FAILURE,
        error,
        meta: body ? body.body : null,
      });

      dispatch(showError(error));

      throw error;
    }
  };
}
