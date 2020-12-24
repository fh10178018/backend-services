const mongoose = require('mongoose')
const { Schema, model } = mongoose
const today = new Date(Date.now()).getTime()

const MessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, default: today },
  ip: { type: String, required: true },
  message: { type: String, required: true },
  creatTime: { type: Number, default: today },
  isRead: { type: Boolean, default: false }
})

const Message = model('Message', MessageSchema)
module.exports = Message