const TresholdID = require('../models/tresholdId');
const Food = require('../models/food');
const User = require('../models/user');

TresholdID.remove({})
  .then((resp) => {
    console.log(resp);
  })
  .catch((error) => {
    console.log(error);
  });
// Food.remove({}).then((resp) => {
//     console.log(resp)
// }).catch((error) => {console.log(error)})
// User.remove({}).then((resp) => {
//     console.log(resp)
// }).catch((err) => {
//     console.log(err)
// })
