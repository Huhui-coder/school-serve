var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.cookie("name",'zhangsan',{maxAge: 900000, httpOnly: true}); 
  res.render('index', { title: '嗯嗯' });
});


router.get('/get', function(req, res, next) {
  var cookies_name = req.cookies.name ;
  
  res.json({
    msg:cookies_name
  })
});



module.exports = router;
