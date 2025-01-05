
const mongoose = require('mongoose')


const frndreqSchema =mongoose.Schema({
  toId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },

  fromId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  status: {
      type: Boolean,
      default: false
  }
}, {
  timestamps: true
})

  module.exports = mongoose.model('frndreq', frndreqSchema);