const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  plan: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  },
  period: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    set: (val) => Math.round(val),
    get: (val) => Math.round(val)
  },
  multiDevicePrice: {
    type: Number,
    required: true,
    min: 0,
    set: (val) => Math.round(val),
    get: (val) => Math.round(val)
  }
})

const Plan = mongoose.model('plan', planSchema);

module.exports.Plan = Plan;