var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Article = require('../models/article');

var localStorage = require('localStorage');
require('../util/util')

//获取所有商家的岗位信息列表
router.get('/allPost', function (req, res, next) {
    Company.find({}, function (err, doc) {
        let array = []
        doc.map((item)=>array.push(item.releaseList.map((item)=>item)))
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
    Company.find({}, function (err, doc) {
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

//获取该商家的全部人才记录
router.get('/myApplyList', function (req, res, next) {
    let _this = req.query,
      companyId = _this.companyId;
    Company.find({ companyId: companyId }, function (err, doc) {
      if (err) {
        res.json({
          code: '1',
          msg: err.message
        });
      } else {
        if (doc[0].receiveId) {
          var result = doc[0].receiveId
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

//商家登陆
router.post("/login", function (req, res, next) {
    var _this = req.body
    var param = {
        userName: _this.userName,
        userPwd: _this.userPwd
    };
    Company.find(param, function (err, doc) {
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
                        role: 'company'
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
//商家注册
router.post('/register', function (req, res, next) {
    var _this = req.body
    var r1 = Math.floor(Math.random() * 10);
    var r2 = Math.floor(Math.random() * 10);
    var sysDate = new Date().Format('yyyyMMddhhmmss');
    var companyId = r1 + r2 + sysDate;
    var params = {
        companyId: companyId,
        userName: _this.userName,
        userPwd: _this.userPwd,
    };

    Company.find({ userName: _this.userName }, function (err, doc) {
        if (doc.length != 0) {
            res.json({
                status: "1",
                msg: '用户已注册'
            })
        } else {
            var registerCompany = new Company(params)
            registerCompany.save(function () {
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
//商家修改个人资料
router.post('/editCompanyInfo', function (req, res, next) {
    let _this = req.body,
        companyId = _this.companyId;
    Company.find({ companyId: companyId }, function (err, doc) {
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
//商家获取个人资料
router.get('/getCompanyInfo', function (req, res, next) {
    let _this = req.query;
    console.log(_this)
    companyId = _this.companyId;
    Company.find({ companyId: companyId }, function (err, doc) {
        console.log(doc)
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
                        role: 'company'
                    }
                }
            });
        }
    })
})
//商家发布岗位信息
router.post('/addPost', function (req, res, next) {
    let _this = req.body;
    let now = new Date().Format('yyyy-MM-dd hh:mm:ss')
    let r1 = Math.floor(Math.random() * 10);
    let r2 = Math.floor(Math.random() * 10);
    let sysDate = new Date().Format('yyyyMMddhhmmss');
    let postId = r1 + r2 + sysDate;
    companyId = _this.companyId;
    let params = { postId, now, ..._this }
    Company.find({ companyId: companyId }, function (err, doc) {
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
//商家获取该商家所有发布的岗位信息
router.get('/postList', function (req, res, next) {
    let _this = req.query,
        companyId = _this.companyId;
    Company.find({ companyId: companyId }, function (err, doc) {
        if (err) {
            res.json({
                code: '1',
                msg: err.message
            });
        } else {
            if(doc[0].releaseList){
                var result = doc[0].releaseList
            } else{
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
//获取单个岗位需求的详情
router.get('/postDetail', function (req, res, next) {
    let _this = req.query,
        companyId = _this.companyId,
        postId = _this.postId;

    Company.find({ companyId: companyId }, function (err, doc) {
        if (err) {
            res.json({
                code: '1',
                msg: err.message
            });
        } else {
            let result = doc[0].releaseList.filter((item) => item.postId == postId)
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
        { companyId, postId, title } = { ..._this };
    Company.update({
        companyId: companyId,
        "releaseList.postId": postId
    }, {
        $set: { "releaseList.$.title": title }
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
//删除某个对应的岗位信息
router.get('/delPost', function (req, res, next) {
    let _this = req.query,
        { companyId, postId } = { ..._this };
    Company.update({
        companyId: companyId
    }, {
      $pull: {
        'releaseList': {
          'postId': postId
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

//登出接口
router.post("/logout", function (req, res, next) {
    // res.cookie("StudentName",'',{maxAge: 900000, httpOnly: true}); 
    // res.cookie("companyId",'',{maxAge: 900000, httpOnly: true}); 
    localStorage.setItem('StudentName', '');
    localStorage.setItem('companyId', '');

    res.json({
        status: "0",
        msg: '',
        result: ''
    })
});

// 检查登录状态cookies
router.get("/checkLogin", function (req, res, next) {
    if (localStorage.getItem('companyId')) {
        res.json({
            status: '0',
            msg: '',
            result: [localStorage.getItem('StudentName'), localStorage.getItem('companyId')] || ''
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
    //var companyId = req.cookies.companyId;
    var companyId = localStorage.getItem('companyId');
    //console.log(merchantId)
    //var companyId = req.param('companyId');
    var r1 = Math.floor(Math.random() * 10);
    var r2 = Math.floor(Math.random() * 10);
    var sysDate = new Date().Format('yyyyMMddhhmmss');
    var this_Date = new Date().Format('yyyy-MM-dd hh:mm:ss');
    var articleId = r1 + r2 + sysDate;
    if (!companyId) {
        res.json({
            status: '1',
            msg: '请先登陆..'
        })
    } else {
        var AddAricle = new Article({
            "articleId": articleId,
            "companyId": companyId,
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
    // var companyId = req.cookies.companyId;
    var companyId = localStorage.getItem('companyId');

    Student.update({
        companyId: companyId
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
    // var companyId = req.cookies.companyId;
    var companyId = localStorage.getItem('companyId');

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
    Student.find({ companyId: companyId }, function (err, doc1) {
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
    //var companyId = req.cookies.companyId;
    var articleId = req.param('articleId');
    // var companyId = req.cookies.companyId;
    var companyId = localStorage.getItem('companyId');
    // var companyId = '920190405154458'
    var this_Date = new Date().Format('yyyy-MM-dd hh:mm:ss');
    var Student_params = {
        articleId: articleId,
        content: req.param('content'),
        time: this_Date
    };
    Student.find({ companyId: companyId }, function (err, doc) {
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
    // var companyId = req.cookies.companyId;
    var companyId = localStorage.getItem('companyId')
    Student.update({
        companyId: companyId
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
    // var companyId = req.cookies.companyId;
    var companyId = localStorage.getItem('companyId');
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
    Student.find({ companyId: companyId }, function (err, doc1) {
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
    // var companyId = req.cookies.companyId;
    var companyId = localStorage.getItem('companyId')
    Student.find({ companyId: companyId }, function (err, doc) {
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
    // var companyId =req.cookies.companyId;
    var companyId = localStorage.getItem('companyId')
    Student.find({ companyId: companyId }, function (err, doc) {
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
    // var companyId = req.cookies.companyId;
    var companyId = localStorage.getItem('companyId')
    Student.find({ companyId: companyId }, function (err, doc) {
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
