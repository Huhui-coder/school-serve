var express = require('express');
var router = express.Router();
var Student = require('../models/student');
var Company = require('../models/company');

var Article = require('../models/article');

var localStorage = require('localStorage');
var mongoose = require('mongoose');
require('../util/util')



//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/myBlog');

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
    doc.map((item) => array.push(item.releaseList.map((item)=>item)))
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
//登出接口
router.post("/logout", function (req, res, next) {
  // res.cookie("StudentName",'',{maxAge: 900000, httpOnly: true}); 
  // res.cookie("StudentId",'',{maxAge: 900000, httpOnly: true}); 
  localStorage.setItem('StudentName', '');
  localStorage.setItem('StudentId', '');

  res.json({
    status: "0",
    msg: '',
    result: ''
  })
});

// 检查登录状态cookies
router.get("/checkLogin", function (req, res, next) {
  if (localStorage.getItem('StudentId')) {
    res.json({
      status: '0',
      msg: '',
      result: [localStorage.getItem('StudentName'), localStorage.getItem('StudentId')] || ''
    });
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    });
  }
});
//用户发表新文章
router.get('/add', function (req, res, next) {
  //var StudentId = req.cookies.StudentId;
  var StudentId = localStorage.getItem('StudentId');
  //console.log(merchantId)
  //var StudentId = req.param('StudentId');
  var r1 = Math.floor(Math.random() * 10);
  var r2 = Math.floor(Math.random() * 10);
  var sysDate = new Date().Format('yyyyMMddhhmmss');
  var this_Date = new Date().Format('yyyy-MM-dd hh:mm:ss');
  var articleId = r1 + r2 + sysDate;
  if (!StudentId) {
    res.json({
      status: '1',
      msg: '请先登陆..'
    })
  } else {
    var AddAricle = new Article({
      "articleId": articleId,
      "StudentId": StudentId,
      "title": req.param('title'),
      "content": req.param('content'),
      "type": req.param('type'),
      "collectnum": '0',
      "likenum": '0',
      "viewsnum": '0',
      "time": this_Date

    })
    AddAricle.save(function () {
      res.json({
        status: '0',
        msg: '发帖成功',
        result: AddAricle
      })
    })

  }


});
//用户点击之后进入文章详情页面
router.get('/article_detail', function (req, res, next) {
  var articleId = req.param('articleId')
  Article.find({ articleId: articleId }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      if (doc) {
        doc[0].viewsnum += 1
      }
      doc[0].save(function (err, doc1) {
        res.json({
          status: '0',
          msg: '正在进入...',
          result: doc1
        })

      })
    }
  })
})
//用户取消点赞
router.get('/del_zan', function (req, res, next) {
  var articleId = req.param('articleId')
  // var StudentId = req.cookies.StudentId;
  var StudentId = localStorage.getItem('StudentId');

  Student.update({
    StudentId: StudentId
  }, {
    $pull: {
      'like': {
        'articleId': articleId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: '删除点赞失败'
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: '删除点赞成功'
      });
    }
  });
})

//用户为该文章点赞  同时完成 收藏数+1 ，用户表中增加收藏文章
router.get('/add_zan', function (req, res, next) {
  var articleId = req.param('articleId')
  // var StudentId = req.cookies.StudentId;
  var StudentId = localStorage.getItem('StudentId');

  Article.find({ articleId: articleId }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      if (doc) {
        doc[0].likenum += 1
      }
      doc[0].save(function (err, doc) {
      })
    }
  })
  var params = {
    articleId: req.param('articleId')
  };
  Student.find({ StudentId: StudentId }, function (err, doc1) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc1) {
        let houseItem = '';
        doc1[0].like.forEach(function (item) {
          if (item.articleId == params.articleId) {
            houseItem = item;
          }
        })
        if (houseItem) {
          res.json({
            status: '4',
            msg: '您已经收藏过了'
          })
        } else {
          doc1[0].like.push(params);
          doc1[0].save(function () {
            res.json({
              status: '0',
              msg: '收藏成功'
            })
          })
        }
      }

    }
  })

})

//用户对文章发表评论
router.get('/addcomment', function (req, res, next) {
  //var StudentId = req.cookies.StudentId;
  var articleId = req.param('articleId');
  // var StudentId = req.cookies.StudentId;
  var StudentId = localStorage.getItem('StudentId');
  // var StudentId = '920190405154458'
  var this_Date = new Date().Format('yyyy-MM-dd hh:mm:ss');
  var Student_params = {
    articleId: articleId,
    content: req.param('content'),
    time: this_Date
  };
  Student.find({ StudentId: StudentId }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        doc[0].comment.push(Student_params);
        doc[0].save(function () {
          res.json({
            status: '0',
            msg: '评论成功',
            result: doc
          })
        })
      }
    }
  })
})
//用户去取消收藏
router.get('/del_collect', function (req, res, next) {
  var articleId = req.param('articleId')
  // var StudentId = req.cookies.StudentId;
  var StudentId = localStorage.getItem('StudentId')
  Student.update({
    StudentId: StudentId
  }, {
    $pull: {
      'collect': {
        'articleId': articleId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: '删除收藏失败'
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: '删除收藏成功'
      });
    }
  });
})
//用户对文章进行收藏操作  同时完成 收藏数+1 ，用户表中增加收藏文章
router.get('/add_collect', function (req, res, next) {
  var articleId = req.param('articleId')
  // var StudentId = req.cookies.StudentId;
  var StudentId = localStorage.getItem('StudentId');
  Article.find({ articleId: articleId }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      if (doc) {
        doc[0].collectnum += 1
      }
      doc[0].save(function (err, doc) {
      })
    }
  })
  var params = {
    articleId: req.param('articleId')
  };
  Student.find({ StudentId: StudentId }, function (err, doc1) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc1) {
        let houseItem = '';
        doc1[0].collect.forEach(function (item) {
          if (item.articleId == params.articleId) {
            houseItem = item;
          }
        })
        if (houseItem) {
          res.json({
            status: '4',
            msg: '您已经收藏过了'
          })
        } else {
          doc1[0].collect.push(params);
          doc1[0].save(function () {
            res.json({
              status: '0',
              msg: '收藏成功'
            })
          })
        }
      }

    }
  })

})
//展示用户所有的评论
router.get('/showallcomment', function (req, res, next) {
  // var StudentId = req.cookies.StudentId;
  var StudentId = localStorage.getItem('StudentId')
  Student.find({ StudentId: StudentId }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        result: doc[0].comment
      })

    }
  })
})

//展示用户所有的收藏
router.get('/showallcollect', function (req, res, next) {
  // var StudentId =req.cookies.StudentId;
  var StudentId = localStorage.getItem('StudentId')
  Student.find({ StudentId: StudentId }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        result: doc[0].collect
      })

    }
  })
})

//展示用户所有的点赞
router.get('/showallzan', function (req, res, next) {
  // var StudentId = req.cookies.StudentId;
  var StudentId = localStorage.getItem('StudentId')
  Student.find({ StudentId: StudentId }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        result: doc[0].like
      })

    }
  })
})
















module.exports = router;
