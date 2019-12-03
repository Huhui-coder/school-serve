var mongoose = require('mongoose')
  var articleSchema = new mongoose.Schema({
    "articleId":String,
    "userId":String,
    "title":String,
    "content":String,
    "type":String,
    "collectnum":Number,
    "viewsnum":Number,
    "likenum":Number,
    "time": Date
  })

module.exports = mongoose.model("Article",articleSchema);
