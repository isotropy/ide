const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
// import { Strategy as FacebookStrategy } from 'passport-facebook';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
const credentials = require("./credentials");

const AuthRouter = (app, express) => {

  const router = express.Router();

  passport.use(new GitHubStrategy({
    clientID: credentials.github.clientID,
    clientSecret: credentials.github.clientSecret,
    callbackURL: credentials.github.callbackURL
  }, (accessToken, refreshToken, profile, cb) => cb(null, profile)));
  
  // passport.use(new FacebookStrategy({
  //   clientID: CONFIG.facebook.appID,
  //   clientSecret: CONFIG.facebook.appSecret,
  //   callbackURL: CONFIG.facebook.callbackURL,
  //   profileFields: CONFIG.facebook.permissions
  // }, (accessToken, refreshToken, profile, cb) => cb(null, profile)));

  // passport.use(new GoogleStrategy({
  //   clientID: CONFIG.google.appID,
  //   clientSecret: CONFIG.google.appSecret,
  //   callbackURL: CONFIG.google.callbackURL,
  // }, (accessToken, refreshToken, profile, cb) => cb(null, profile)));

  passport.serializeUser((user, cb) => cb(null, user));

  passport.deserializeUser((user, cb) => cb(null, user));

  router.get('/github',
    passport.authenticate('github', { display: 'popup' }));

  router.get('/google',
    passport.authenticate('google', { scope: ['profile'] }));

  router.get('/google/return', 
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/');
    });

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');  
  });

  return router;
};


const Routes = (app, express) => {

  const router = express.Router();
  router.use('/auth', AuthRouter(app, express));

  return router;
};

module.exports = Routes;