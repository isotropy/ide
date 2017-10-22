import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { ConnectedRouter } from 'react-router-redux';
import registerServiceWorker from 'codesandbox/common/registerServiceWorker';
import 'normalize.css';
import notificationActions from 'codesandbox/app/store/notifications/actions';

import App from 'codesandbox/app/pages/index';
import 'codesandbox/common/global.css';
import 'codesandbox/app/split-pane.css';
import createStore from 'codesandbox/app/store';
import theme from 'codesandbox/common/theme';
import logError from 'codesandbox/app/utils/error';
import history from 'codesandbox/app/utils/history';

const rootEl = document.getElementById('root');

const store = createStore(history);

const showNotification = (message, type) =>
  store.dispatch(notificationActions.addNotification(message, type));

registerServiceWorker('/service-worker.js', showNotification);

const renderApp = RootComponent => {
  try {
    render(
      <AppContainer>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <ConnectedRouter history={history}>
              <RootComponent store={store} />
            </ConnectedRouter>
          </Provider>
        </ThemeProvider>
      </AppContainer>,
      rootEl
    );
  } catch (e) {
    logError(e);
  }
};

renderApp(App);

if (module.hot) {
  module.hot.accept('codesandbox/app/pages/index', () => {
    const NextApp = require('codesandbox/app/pages/index').default; // eslint-disable-line global-require
    renderApp(NextApp);
  });

  module.hot.accept('codesandbox/common/theme', () => {
    const NextApp = require('codesandbox/app/pages/index').default; // eslint-disable-line global-require
    renderApp(NextApp);
  });
}
