const express = require('express');
const passportAuth = require('../config/passport');
const Food = require('../models/food');
const foodsByUser = express.Router();

foodsByUser.use(express.json());

foodsByUser
  .route('/')
  .get(passportAuth.verifyUser, (req, res, next) => {
    Food.find({ user: req.user._id })
      .populate('user')
      .sort({ createdAt: -1 })
      .then(
        (foods) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(foods);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .delete(passportAuth.verifyUser, (req, res, next) => {
    Food.remove({ user: req.user._id })
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

module.exports = foodsByUser;
