const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema({
  websiteName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});


const WebsiteCredentials = mongoose.model('WebsiteCredentials', itemSchema);

module.exports = WebsiteCredentials;