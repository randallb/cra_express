var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var pagesRouter = require('./routes/pages');

var app = express();

app.use(function(req, res, next) {
  if (req.app.get('env') === 'development') {
    return next();
  }
  var redirectingUrl;
  if (req.get('x-forwarded-proto') === "https" || req.get('x_forwarded_proto') === "https") {
    return next();
  } else {
    redirectingUrl = "https://" + req.hostname + req.url;
    console.log("Insecure request, redirecting to " + redirectingUrl);
    return res.redirect(redirectingUrl);
  }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/pages', pagesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if (req.app.get('env') === 'development') {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    return res.render('error');
  }
  return next();
});

app.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});



module.exports = app;
