var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  "studentId":String,
  "nickName":String,
  "userName":String,
  "userPwd":String,
  "isVIP":Boolean,
  "phone":Number,
  "position":String,
  "area":String,
  "salary":Number,
  "pdf":String,
  "deliveredList":[{  //已投递的岗位ID
    "postId":String
    }],
    "releaseList":[] //已发布的兼职请求
});

module.exports = mongoose.model("User",userSchema);
