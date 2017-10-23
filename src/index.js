const express = require('express');
const passport = require('passport');
const Routes = require('./routes');
const path = require('path');

const app = express();

const port = process.env.PORT || 8080;

app.use(passport.initialize());
app.use(passport.session());

app.use(Routes(app, express));

app.use(express.static(path.resolve(__dirname, '..', 'build')));

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