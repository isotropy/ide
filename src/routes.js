const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const credentials = require("./credentials");
const url = require('url'); 

const AuthRouter = (app, express) => {

  const router = express.Router();

  passport.use(new GitHubStrategy({
    clientID: credentials.github.clientID,
    clientSecret: credentials.github.clientSecret,
    callbackURL: credentials.github.callbackURL
  }, (accessToken, refreshToken, profile, cb) => cb(null, profile)));
  
  passport.use(new FacebookStrategy({
    clientID: credentials.facebook.clientID,
    clientSecret: credentials.facebook.clientSecret,
    callbackURL: credentials.facebook.callbackURL
  }, (accessToken, refreshToken, profile, cb) => cb(null, profile)));

  passport.use(new GoogleStrategy({
    clientID: credentials.google.clientID,
    clientSecret: credentials.google.clientSecret,
    callbackURL: credentials.google.callbackURL,
  }, (accessToken, refreshToken, profile, cb) => cb(null, profile)));

  passport.serializeUser((user, cb) => cb(null, user));

  passport.deserializeUser((user, cb) => cb(null, user));

  router.get('/github',
    passport.authenticate('github', { display: 'popup' }));
    
  router.get('/facebook',
    passport.authenticate('facebook', { display: 'popup' }));

  router.get('/google',
    passport.authenticate('google', { scope: ['profile'] }));
    
  router.get('/github/return',
  passport.authenticate('github'),
  (req, res) => {
    res.redirect(url.format({
      pathname:"/signin",
      query:req.query,
    }));
  });

  router.get('/facebook/return',
  passport.authenticate('facebook'),
  (req, res) => {
    res.redirect(url.format({
      pathname:"/signin",
      query:req.query,
    }));
  });
  
  router.get('/google/return',
  passport.authenticate('google'),
  (req, res) => {
    res.redirect(url.format({
      pathname:"/signin",
      query:req.query,
    }));
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