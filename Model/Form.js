const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
},{timestamps : true});

module.exports = mongoose.model('Form', formSchema);
