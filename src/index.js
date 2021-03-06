const express = require('express');
const passport = require('passport');
const Routes = require('./routes');
const path = require('path');
const wildcardSubdomains = require('wildcard-subdomains');

const app = express();

const port = process.env.PORT || 8080;

app.use(passport.initialize());
app.use(passport.session());

app.use(Routes(app, express));
app.use(wildcardSubdomains({
  whitelist: ['edit']
}));

app.use(express.static(path.resolve(__dirname, '..', 'build')));
app.use('/_sub/:sandbox', express.static(path.resolve(__dirname, '..', 'build')));

app.get('/_sub/:sandbox', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'frame.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'app.html'));
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception Error: ${err}`);
});

app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`Server listening on port: ${port}`);
});