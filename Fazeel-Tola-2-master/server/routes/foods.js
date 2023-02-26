const express = require('express');
const passportAuth = require('../config/passport');
const Food = require('../models/food');
const foodsRouter = express.Router();

foodsRouter.use(express.json());

foodsRouter
  .route('/')
  .get(passportAuth.verifyUser, passportAuth.verifyAdmin, (req, res, next) => {
    Food.find({})
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

  .post(passportAuth.verifyUser, (req, res, next) => {
    Food.create({
      user: req.user._id,
      name: req.body.name,
      calorie: req.body.calorie,
    })
      .then(
        (food) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(food);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .delete((req, res, next) => {
    Food.remove({})
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

foodsRouter
  .route('/:id')
  .get(passportAuth.verifyUser, (req, res, next) => {
    Food.findById(req.params.id)
      .populate('user')
      .then(
        (food) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(food);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put(passportAuth.verifyUser, (req, res, next) => {
    Food.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (food) => {
          Food.find({})
            .populate('user')
            .then(
              (foods) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(foods);
              },
              (err) => next(err)
            );
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(passportAuth.verifyUser, (req, res, next) => {
    Food.findByIdAndRemove(req.params.id)
      .then(
        (resp) => {
          Food.find({})
            .populate('user')
            .then(
              (foods) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(foods);
              },
              (err) => next(err)
            );
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = foodsRouter;
