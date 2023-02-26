const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const secretKey = 'THE-NAME-OF-THE-STUDENTS-IS-STILL-UNKNOWN';

const cookieExtractor = (req) => {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token;
};

exports.getToken = function (user) {
  return jwt.sign(user, secretKey, { expiresIn: '30d' });
};

var opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log('JWT payload: ', jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = function (req, res, next) {
  if (req.user.admin === true) {
    next();
  } else {
    var err = new Error('You are not authorized to perform this operation!');
    err.status = 403;
    next(err);
  }
};
