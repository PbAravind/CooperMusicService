const mongoose = require('mongoose');
const { User } = require('./user');
const { Plan } = require('./plan')

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Plan,
    required: true
  },
  subscriptionStartDate: {
    type: Date,
    default: Date.now(),
    required: true
  },
  subscriptionEndDate: {
    type: Date,
    required: true
  },
  registeredDevice: {
    type: String,
    required: true,
    enum: ['Mobile', 'Web', 'Tablet']
  },
  multiDeviceSupport: {
    type: Boolean,
    default: false,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true
  }
})

const Subscription = mongoose.model('subscription', subscriptionSchema);

module.exports.Subscription = Subscription;