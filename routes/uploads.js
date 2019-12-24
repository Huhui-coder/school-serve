const express = require('express');
const router = express.Router();
const multer = require('multer');
var Student = require('../models/student');


let upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/uploads/');
        },
        filename: function(req, file, cb) {
            console.log(file)
            var changedName = (new Date().getTime()) + '-' + file.originalname;
            cb(null, changedName);
        }
    })
});

//单个文件上传
router.post('/single', upload.single('file'), (req, res) => { //注意这个recfile  在前端上传时，input的name同样要写这个，才行。
    res.json({
        code: '0',
        type: 'single',
        originalname: req.file.originalname,
        path: req.file.path
    })
});

//多个文件上传
router.post('/multer', upload.array('multerFile'), (req, res) => {
    console.log(req.files);
    let fileList = [];
    req.files.map((elem) => {
        fileList.push({
            originalname: elem.originalname
        })
    });
    res.json({
        code: '0',
        type: 'multer',
        fileList: fileList
    });
});

//文件上传后保存到用户信息表中
router.get('/save', function (req, res, next) {
    let { studentId,path} = req.query;
      Student.find({ studentId: studentId }, function (err, doc) {
        if (err) {
          res.json({
            code: '1',
            msg: err.message
          });
        } else {
          doc[0].pdf = path ;
          doc[0].save(function () {
            res.json({
              status: '0',
              msg: '添加成功',
              result: doc
            })
          })
        }
      })
  });

module.exports = router;