const mongoose = require('mongoose')
const { Schema, model } = mongoose
const today = new Date(Date.now()).getTime()

const FileSchema = new Schema({
  url: { type: String, required: true },
  description: { type: String, required: true },
  creatTime: { type: Number, default: today },
  size: { type: Number, default: 0 },
  type: { type: String, required: true },
  downloadCount: { type: Number, default: 0 }
})

const File = model('File', FileSchema)
module.exports = File