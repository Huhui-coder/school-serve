var mongoose = require('mongoose')
  var articleSchema = new mongoose.Schema({
    "title":String,
    "type":String,
    "text":String,
    "time": Date
  })

module.exports = mongoose.model("Article",articleSchema);
