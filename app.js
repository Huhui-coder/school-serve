var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index'); 
var studentsRouter = require('./routes/students');
var companysRouter = require('./routes/companys');
var adminsRouter = require('./routes/admins');
var articlesRouter = require('./routes/articles');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//设置允许跨域访问该服务.
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); //请求源
  res.header('Access-Control-Allow-Headers', '*'); //请求头
  res.header('Access-Control-Max-Age', 600); //请求时间，对option预请求过滤
  res.header('Access-Control-Allow-Methods', '*'); //请求方法  
  res.header('Content-Type', 'application/json;charset=utf-8');

  if (req.method == 'OPTIONS') {
      res.send(200);
  } else {
      next();
  }
});


app.use('/', indexRouter);
app.use('/students', studentsRouter);
app.use('/companys', companysRouter);
app.use('/admins', adminsRouter);
app.use('/articles', articlesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
