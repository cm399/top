const express = require('express');
const passportAuth = require('../config/passport');
const TresholdId = require('../models/tresholdId');
const tresholdRouter = express.Router();

tresholdRouter.use(express.json());

tresholdRouter
    .route('/update')
    .post(passportAuth.verifyUser,passportAuth.verifyAdmin, (req, res, next)=>{
        TresholdId.updateOne({ user: req.body.userId }, { $set: { limt: req.body.limit } })
        .then(
            (treshold) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(treshold);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
    })

module.exports = tresholdRouter