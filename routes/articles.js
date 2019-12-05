var express = require('express');
var router = express.Router();
var Article = require('../models/article');
require('../util/util')

router.get('/', function (req, res, next) {
    Article.find({}, function (err, doc) {
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

//发表文字
router.post('/add', function (req, res, next) {
    let _this = req.body;
    console.log(_this)
    let time = new Date().Format('yyyyMMddhhmmss');
    let params = {
        title: _this.title,
        type: _this.type,
        text: _this.text,
        time
    };
    let articles = new Article(params)
    articles.save(function () {
        res.json({
            status: '0',
            msg: '',
            result: {
            }
        })
    })
})
//删除文字
router.delete('/del', function (req, res, next) {
    let _this = req.query;
    id = _this.id
    console.log(_this)

    Article.deleteOne({ _id: id }, function (err, doc) {
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

//查找文字详情
router.get('/detail', function (req, res, next) {
    let _this = req.query;
    id = _this.id
    console.log(_this)

    Article.find({ _id: id }, function (err, doc) {
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
})



module.exports = router;
