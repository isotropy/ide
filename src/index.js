const express = require('express');
const passport = require('passport');
const Routes = require('./routes');

const app = express();

const port = process.env.PORT || 8080;

app.use(passport.initialize());
app.use(passport.session());

app.use(Routes(app, express));

app.use((err, req, res) => {
  console.warn(`Internal server error: ${err}`);
  res.status(err.status || 500).send('Internal Server Error');
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception Error: ${err}`);
});

app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`Server listening on port: ${port}`);
});