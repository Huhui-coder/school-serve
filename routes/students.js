var express = require('express');
var router = express.Router();
var Student = require('../models/student');
var Company = require('../models/company');
var mongoose = require('mongoose');
require('../util/util')

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/schoolWebstie');

mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.")
});

mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
});

//获取所有商家的岗位信息列表
router.get('/allApply', function (req, res, next) {
  Student.find({}, function (err, doc) {
    let array = []
    doc.map((item) => array.push(item.releaseList.map((item) => item)))
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: array
      });
    }
  })
})
/* GET Students listing. */
router.get('/', function (req, res, next) {
  Student.find({}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc
      });
    }
  })
})

//用户登陆
router.post("/login", function (req, res, next) {
  var _this = req.body
  var param = {
    userName: _this.userName,
    userPwd: _this.userPwd
  };
  Student.find(param, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      });
    } else {
      if (doc.length != 0) {
        res.json({
          status: '0',
          msg: '',
          result: {
            info: doc[0],
            role: 'student'
          }
        });
      } else {
        res.json({
          status: '1',
          msg: '账号密码错误',
        }
        )
      }
    }
  });
});
//用户注册
router.post('/register', function (req, res, next) {
  var _this = req.body
  var r1 = Math.floor(Math.random() * 10);
  var r2 = Math.floor(Math.random() * 10);
  var sysDate = new Date().Format('yyyyMMddhhmmss');
  var studentId = r1 + r2 + sysDate;
  var params = {
    studentId: studentId,
    userName: _this.userName,
    userPwd: _this.userPwd,
    isVIP: false
  };

  Student.find({ userName: _this.userName }, function (err, doc) {
    if (doc.length != 0) {
      res.json({
        status: "1",
        msg: '用户已注册'
      })
    } else {
      var registerStudent = new Student(params)
      registerStudent.save(function () {
        res.json({
          status: '0',
          msg: '',
          result: {
          }
        })
      })
    }
  });
})
//学生修改个人资料
router.post('/editUserInfo', function (req, res, next) {
  let _this = req.body,
    studentId = _this.studentId;
  Student.find({ studentId: studentId }, function (err, doc) {
    doc[0] = Object.assign(doc[0], { ..._this })
    doc[0].save((err, doc) => {
    })
    if (err) {
      res.json({
        code: '1',
        msg: err.message
      });
    } else {
      res.json({
        code: '0',
        msg: '',
        data: doc
      });
    }
  })
})
//学生获取个人资料
router.get('/getUserInfo', function (req, res, next) {
  let _this = req.query;
  studentId = _this.studentId;
  Student.find({ studentId: studentId }, function (err, doc) {
    if (err) {
      res.json({
        code: '1',
        msg: err.message
      });
    } else {
      res.json({
        result: {
          status: '0',
          msg: '',
          data: {
            info: doc[0],
            role: 'student'
          }
        }
      });
    }
  })
})
//学生发布求职信息
router.post('/addApply', function (req, res, next) {
  let _this = req.body,
    studentId = _this.studentId;
  let now = new Date().Format('yyyy-MM-dd hh:mm:ss')
  let r1 = Math.floor(Math.random() * 10);
  let r2 = Math.floor(Math.random() * 10);
  let sysDate = new Date().Format('yyyyMMddhhmmss');
  let applyId = r1 + r2 + sysDate;
  let params = { applyId, now, ..._this }
  Student.find({ studentId: studentId }, function (err, doc) {
    if (err) {
      res.json({
        code: '1',
        msg: err.message
      });
    } else {
      doc[0].releaseList.push(params);
      doc[0].save(function () {
        res.json({
          status: '0',
          msg: '添加成功',
          result: doc
        })
      })
    }
  })
})
//学生获取该学生所有发布的求职信息
router.get('/ApplyList', function (req, res, next) {
  let _this = req.query,
    studentId = _this.studentId;
  Student.find({ studentId: studentId }, function (err, doc) {
    if (err) {
      res.json({
        code: '1',
        msg: err.message
      });
    } else {
      if (doc[0].releaseList) {
        var result = doc[0].releaseList
      } else {
        result = []
      }
      res.json({
        status: '0',
        msg: '添加成功',
        result: result
      })
    }
  })
})
//获取该学生的全部投递记录
router.get('/myPostList', function (req, res, next) {
  let _this = req.query,
    studentId = _this.studentId;
  Student.find({ studentId: studentId }, function (err, doc) {
    if (err) {
      res.json({
        code: '1',
        msg: err.message
      });
    } else {
      if (doc[0].deliveredList) {
        var result = doc[0].deliveredList
      } else {
        result = []
      }
      res.json({
        status: '0',
        msg: '添加成功',
        result: result
      })
    }
  })
})
//获取单个求职需求的详情
router.get('/applyDetail', function (req, res, next) {
  let _this = req.query,
    studentId = _this.studentId,
    applyId = _this.applyId;

  Student.find({ studentId: studentId }, function (err, doc) {
    if (err) {
      res.json({
        code: '1',
        msg: err.message
      });
    } else {
      console.log(doc)
      let result = doc[0].releaseList.filter((item) => item.applyId == applyId)
      res.json({
        status: '0',
        msg: '添加成功',
        result: result
      })
    }
  })
})
//修改对应岗位需求
router.post('/edit', function (req, res, next) {
  let _this = req.body,
    { studentId, applyId, post } = { ..._this };
  Student.update({
    studentId: studentId,
    "releaseList.applyId": applyId
  }, {
    $set: { "releaseList.$.post": post }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: '失败'
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: '成功'
      });
    }
  })
})
//删除某个对应的求职信息
router.get('/delApply', function (req, res, next) {
  let _this = req.query,
    { studentId, applyId } = { ..._this };
  Student.update({
    studentId: studentId
  }, {
    $pull: {
      'releaseList': {
        'applyId': applyId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: doc
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc
      });
    }
  });
})
//学生投递简历，一个往自己的数据里面添加公司ID,另一个是往公司的数据里面添加学生ID.
router.get('/delivery', function (req, res, next) {
  let _this = req.query,
    Item,
    CompanyItem,
    { studentId, companyId, postId } = _this;

  Company.find({ companyId: companyId }, function (err, doc1) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc1) {
        doc1[0].receiveId.forEach(function (item) {
          if (item.studentId == studentId) {
            CompanyItem = item;
          }
        })
        if (CompanyItem) {
        } else {
          doc1[0].receiveId.push({ studentId });
          doc1[0].save(function () {
          })
        }
      }
    }
  })
  Student.find({ studentId: studentId }, function (err, doc1) {
    if (err) {
    } else {
      if (doc1) {
        doc1[0].deliveredList.forEach(function (item) {
          if (item.postId == postId) {
            Item = item;
          }
        })
        if (Item) {
          res.json({
            status: '1',
            msg: '您已经投递过了'
          })
        } else {
          doc1[0].deliveredList.push({ postId });
          doc1[0].save(function () {
            res.json({
              status: '0',
              msg: '成功'
            })
          })
        }
      }
    }
  })
})

//使学生注册成为VIP
router.get('/beVIP', function (req, res, next) {
  let _this = req.query,
    studentId = _this.studentId;
  Student.update({ studentId: studentId }, { $set: { isVIP: true } }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: '失败'
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: '成功'
      });
    }
  })
});
//获取学生个人信息
router.get('/info', function (req, res, next) {
  let _this = req.query,
    studentId = _this.studentId;
  console.log(_this)
  Student.find({ studentId: studentId }, function (err, doc) {
    console.log(doc)
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: '失败'
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc[0]
      });
    }
  })
});

module.exports = router;
