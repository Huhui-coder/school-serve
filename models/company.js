var mongoose = require('mongoose');

var companySchema = new mongoose.Schema({
  "companyId": String,
  "userName": String,
  "userPwd": String,
  "isVIP": Boolean,
  "phone": Number,
  "position": String,
  "companyName": String,
  "introduction": String,
  "area": String,
  "releaseList": [],  //已发布的岗位
  "receiveId": [{
    "studentId": String //已收到的学生请求
  }]
});

module.exports = mongoose.model("Companyr", companySchema);
