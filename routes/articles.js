var express = require('express');
var router = express.Router();
var User = require('../models/student');
var Article = require('../models/article')
var localStorage = require('localStorage');
var mongoose = require('mongoose');
require('../util/util')

//展示所有的文章
router.get('/',function(req,res,next){
    Article.find({},function (err,doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message
        });
      }else{
        res.json({
          status:'0',
          msg:'',
          result:doc
        });
      }
    })
  })
  //展示搜索到的结果
  router.get('/search',function(req,res,next){
    var keyword = req.param('keyword')
    Article.find({"content":{$regex:keyword}},function (err,doc){
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
  //展示对应id的文章
  router.get('/detail',function(req,res,next){
    var articleId = req.param('articleId') 
    Article.find({articleId:articleId},function (err,doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message
        });
      }else{
        res.json({
          status:'0',
          msg:'',
          result:doc
        });
      }
    })
  })
  //展示对应文章的所有评论
  router.get('/showcomment',function(req,res,next){
    //var userId = req.cookies.userId;
    var articleId = req.param('articleId');
  
    var userId = req.cookies.userId;
    var userrecive = [];
    //console.log(userId)
   
    User.find({},function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                doc.forEach(item=>{
                    item.comment.forEach(item1 =>{
                      if(item1.articleId == articleId){
                        userrecive.push(item1.content)
                      }
                    })
                  })
                  res.json({
                    status:'0',
                    result:doc
                  })
            }
              }
            })
  })


module.exports = router;
