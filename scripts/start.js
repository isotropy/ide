const http = require('http');
const httpProxy = require('http-proxy');
const express = require('express');

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const fs = require('fs');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const historyApiFallback = require('connect-history-api-fallback');
const proxy = require('http-proxy-middleware');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const paths = require('../config/paths');
const config = require('../config/webpack.config.dev');
const createDevServerConfig = require('../config/webpackDevServer.config');

const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

let handleCompile;

function setupCompiler(port, protocol) {
  // "Compiler" is a low-level interface to Webpack.
  // It lets us listen to some events and provide our own custom messages.
  compiler = webpack(config, handleCompile);

  // "invalid" event fires when you have changed a file, and Webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  compiler.plugin('invalid', () => {
    clearConsole();
    console.log('Compiling...');
  });

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.plugin('done', stats => {
    clearConsole();
    const hasErrors = stats.hasErrors();
    const hasWarnings = stats.hasWarnings();
    if (!hasErrors && !hasWarnings) {
      console.log(chalk.green('Compiled successfully!'));
      console.log();
      console.log('The app is running at:');
      console.log();
      console.log(`  ${  chalk.cyan(`${protocol  }://localhost:${  port  }/`)}`);
      console.log();
      console.log('Note that the development build is not optimized.');
      console.log(
        `To create a production build, use ${  chalk.cyan('npm run build')  }.`
      );
      console.log();
      return;
    }

    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    // We use stats.toJson({}, true) to make output more compact and readable:
    // https://github.com/facebookincubator/create-react-app/issues/401#issuecomment-238291901
    const json = stats.toJson({}, true);
    let formattedErrors = json.errors.map(
      message => `Error in ${  formatMessage(message)}`
    );
    const formattedWarnings = json.warnings.map(
      message => `Warning in ${  formatMessage(message)}`
    );
    if (hasErrors) {
      console.log(chalk.red('Failed to compile.'));
      console.log();
      if (formattedErrors.some(isLikelyASyntaxError)) {
        // If there are any syntax errors, show just them.
        // This prevents a confusing ESLint parsing error
        // preceding a much more useful Babel syntax error.
        formattedErrors = formattedErrors.filter(isLikelyASyntaxError);
      }
      formattedErrors.forEach(message => {
        console.log(message);
        console.log();
      });
      // If errors exist, ignore warnings.
      return;
    }
    if (hasWarnings) {
      console.log(chalk.yellow('Compiled with warnings.'));
      console.log();
      formattedWarnings.forEach(message => {
        console.log(message);
        console.log();
      });
      // Teach some ESLint tricks.
      console.log('You may use special comments to disable some warnings.');
      console.log(
        `Use ${ 
          chalk.yellow('// eslint-disable-next-line') 
          } to ignore the next line.`
      );
      console.log(
        `Use ${ 
          chalk.yellow('/* eslint-disable */') 
          } to ignore all warnings in a file.`
      );
    }
  });
}

function addMiddleware(devServer, index) {
  devServer.use((req, res, next) => {
    if (req.url === '/') {
      req.url = '/homepage';
    }
    next();
  });
  // devServer.use('/homepage', express.static(paths.homepageSrc));
  devServer.use(
    historyApiFallback({
      // Allow paths with dots in them to be loaded, reference issue #387
      disableDotRule: true,
      // For single page apps, we generally want to fallback to /index.html.
      // However we also want to respect `proxy` for API calls.
      // So if `proxy` is specified, we need to decide which fallback to use.
      // We use a heuristic: if request `accept`s text/html, we pick /index.html.
      // Modern browsers include text/html into `accept` header when navigating.
      // However API calls like `fetch()` won’t generally won’t accept text/html.
      // If this heuristic doesn’t work well for you, don’t use `proxy`.
      htmlAcceptHeaders: ['text/html'],
      index,
      rewrites: [{ from: /\/embed/, to: '/embed.html' }],
    })
  );
  if (process.env.LOCAL_SERVER) { // TODO: To change when API ready
    devServer.use(
      '/api',
      proxy({ target: 'http://edit.looptype.com', changeOrigin: true })
    );
  }
  // Finally, by now we have certainly resolved the URL.
  // It may be /index.html, so let the dev server try serving it again.
  devServer.use(devServer.middleware);
}

function runDevServer(port, protocol, index) {
  const devServer = new WebpackDevServer(compiler, {
    // Enable hot reloading server. It will provide /sockjs-node/ endpoint
    // for the WebpackDevServer client so it can learn when the files were
    // updated. The WebpackDevServer client is included as an entry point
    // in the Webpack development configuration. Note that only changes
    // to CSS are currently hot reloaded. JS changes will refresh the browser.
    hot: true,
    // It is important to tell WebpackDevServer to use the same "root" path
    // as we specified in the config. In development, we always serve from /.
    publicPath: config.output.publicPath,
    // WebpackDevServer is noisy by default so we emit custom message instead
    // by listening to the compiler events with `compiler.plugin` calls above.
    quiet: true,
    // Reportedly, this avoids CPU overload on some systems.
    // https://github.com/facebookincubator/create-react-app/issues/293
    watchOptions: {
      ignored: /node_modules/,
    },
    // Enable HTTPS if the HTTPS environment variable is set to 'true'
    https: protocol === 'https',
    // contentBase: paths.staticPath,
    host: process.env.LOCAL_SERVER ? 'localhost' : 'edit.looptype.com',
    disableHostCheck: !process.env.LOCAL_SERVER,
    contentBase: false,
    clientLogLevel: 'warning',
    overlay: true,
  });

  // Our custom middleware proxies requests to /index.html or a remote API.
  addMiddleware(devServer, index);

  // Launch WebpackDevServer.
  devServer.listen(port, (err, result) => {
    if (err) {
      return console.log(err);
    }

    clearConsole();
    console.log(chalk.cyan('Starting the development server...'));
    openBrowser(port, protocol);
  });
}

// // We attempt to use the default port but if it is busy, we offer the user to
// // run on a different port. `detect()` Promise resolves to the next free port.
// choosePort(HOST, DEFAULT_PORT)
//   .then(port => {
//     if (port == null) {
//       // We have not found a port.
//       return;
//     }
//     const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
//     const appName = require(paths.appPackageJson).name;
//     const urls = prepareUrls(protocol, HOST, port);
//     // Create a webpack compiler that is configured with custom messages.
//     const compiler = createCompiler(webpack, config, appName, urls, useYarn);
//     // Load proxy config
//     const proxySetting = require(paths.appPackageJson).proxy;
//     const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
//     // Serve webpack assets generated by the compiler over a web sever.
//     const serverConfig = createDevServerConfig(
//       proxyConfig,
//       urls.lanUrlForConfig
//     );
//     const devServer = new WebpackDevServer(compiler, serverConfig);
//     // Launch WebpackDevServer.
//     devServer.listen(port, HOST, err => {
//       if (err) {
//         return console.log(err);
//       }
//       if (isInteractive) {
//         clearConsole();
//       }
//       console.log(chalk.cyan('Starting the development server...\n'));
//       openBrowser(urls.localUrlForBrowser);
//     });

//     ['SIGINT', 'SIGTERM'].forEach((sig) => {
//       process.on(sig, () => {
//         devServer.close();
//         process.exit();
//       });
//     });
//   })
//   .catch(err => {
//     if (err && err.message) {
//       console.log(err.message);
//     }
//     process.exit(1);
//   });

  function run(port) {
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    setupCompiler(port, protocol);
    runDevServer(port, protocol, '/app.html');
  
    if (process.env.LOCAL_SERVER) {
      const proxyServer = httpProxy.createProxyServer({});
      http
        .createServer((req, res) => {
          console.log(req.url);
          if (req.url.includes('.js')) {
            proxyServer.web(req, res, { target: `http://localhost:3000${req.url}` });
          } else {
            proxyServer.web(req, res, {
              target: 'http://localhost:3000/frame.html',
              ignorePath: true,
            });
          }
        })
        .listen(3001);
    }
  }

  run(DEFAULT_PORT);