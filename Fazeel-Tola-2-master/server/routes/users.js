const express = require('express');
const passport = require('passport');
const passportAuth = require('../config/passport');
const User = require('../models/user');
const TresholdID = require('../models/tresholdId');
const usersRouter = express.Router();

usersRouter.get('/', (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) {
      return next(err);
    } else {
      res.statusCode = 200;
      res.setHeader('Content_type', 'application/json');
      res.json(users);
    }
  });
});

usersRouter.post('/signup', (req, res, next) => {
  User.register(
    new User({
      username: req.body.username,
      name: req.body.name,
      admin: req.body.admin,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      } else {
        passport.authenticate('local')(req, res, () => {
          TresholdID.findOne({}, {}, { sort: { createdAt: -1 } })
            .then((post) => {
              if (post === null) {
                console.log(err);
                TresholdID.create({
                  user: req.user._id,
                  tresholdId: 0,
                }).then((post) => {
                  console.log(post);
                });
              }
              if (post) {
                TresholdID.create({
                  user: req.user._id,
                  tresholdId: ++post.tresholdId,
                }).then((post) => {
                  console.log(post);
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Registration Successful!' });
        });
      }
    }
  );
});

usersRouter.post('/login', passport.authenticate('local'), (req, res) => {
  let limitId;
  TresholdID.findOne({ user: req.user._id })
    .then((tresholdId) => {
      console.log(tresholdId);
      limitId = tresholdId.tresholdId;
      console.log(limitId);

      var token = passportAuth.getToken({
        _id: req.user._id,
        admin: req.user.admin,
         limitId: limitId,
      });
      res.cookie('token', token, {
        httpOnly: true,
      });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: true,
        token: token,
        status: 'You are successfully logged in!',
      });
    })
    .catch((error) => console.log(error));
});

usersRouter.delete('/', (req, res, next) => {
  User.remove({})
    .then(
      (resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = usersRouter;
