
var express = require('express');
var router = express.Router();
var User = require('../models/student');
var Admin = require('../models/admin');
var Article = require('../models/article');


var localStorage = require('localStorage');
var mongoose = require('mongoose');
require('../util/util')

router.get('/',function(req,res,next){
    Admin.find({},function (err,doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message
        });
      }else{
        res.json(doc)
      }
    })
  })
  //管理员登陆
router.get("/login", function (req,res,next) {
    var param = {
        adminName:req.query.adminName,
        adminPwd:req.query.adminPwd
    };
    Admin.find(param, function (err,doc) {
        if(err){
            res.json({
                status:"1",
                msg:err.message
            });
        }else{
          if(doc.length != 0){
            res.json({
              status:'0',
              msg:'',
              result:{
                  adminName:doc[0].adminName,
                  role:'company'
              }
          });
          }else{
            res.json('账号密码错误')
          }
                
        }
    });
  });

  //展示所有用户的信息
  router.get('/all',function(req,res,next){
    User.find({},function (err,doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message
        });
      }else{
        res.json( {status:'0',
        msg:'',
        result:doc})
      }
    })
  })

//用户的管理 --删除
router.get('/deluser',function(req,res,next){
    var userId =req.param('userId');
    User.remove({userId:userId},function(err,doc){
      if(err){
        res.json('发生错误')
      }else{
        res.json({
          status:'0',
          msg:'',
          result:'删除成功'
        })
      }
    })
  })
  //用户评论内容管理--删除
  router.get('/delusecomment',function(req,res,next){
   var userId = req.param('userId')
   var articleId = req.param('articleId')
   User.update({
    userId:userId
  },{
    $pull:{
        'comment':{
            'articleId':articleId
        }
    }
  }, function (err,doc) {
    if(err){
        res.json({
            status:'1',
            msg:err.message,
            result:'删除评价失败'
        });
    }else{
        res.json({
            status:'0',
            msg:'',
            result:'删除评价成功'
        });
    }
  });
  })
  
  //删除帖子
  router.get('/delarticle',function(req,res,next){
    var articleId =req.param('articleId');
    Article.remove({articleId:articleId},function(err,doc){
      if(err){
        res.json('发生错误')
      }else{
        res.json({
          status:'0',
          msg:'',
          result:'删除成功'
        })
      }
    })
  })
  //展示所有用户的评论
  router.get('/allcomment',function(req,res,next){
    User.find({},function (err,doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message
        });
      }else{
        res.json(doc)
      }
    })
  })


  
   
module.exports = router;
