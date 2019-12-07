var mongoose = require('mongoose')
  var articleSchema = new mongoose.Schema({
    "title":String,
    "type":String,
    "text":String,
    "time": String
  })

module.exports = mongoose.model("Article",articleSchema);
