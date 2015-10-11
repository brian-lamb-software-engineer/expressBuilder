// https://www.airpair.com/javascript/complete-expressjs-nodejs-mongodb-crud-skeleton#generate-the-express-js-skeleton
var express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  sass = require('node-sass'),

  db = require('./js/model_db'),
  blob = require('./js/model_blobs'),
  routes = require('./js/route_index'),
  users = require('./js/rouite_users'),
  blobs = require('./js/route_blobs');

var app = module.exports.app = exports.app = express();

// new bundle setup
app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join('src/blobBundle', 'views'));


app.set('view engine', 'jade');

// uncomment after placing your favicon in /www
//app.use(favicon(path.join(__dirname, 'www', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'www')));

app.use('/', routes);
app.use('/users', users);
app.use('/blobs', blobs); //can point to / instead for SPA (look at res.redirect's)

// //you won't need 'connect-livereload' if you have livereload plugin for your browser
// app.use(require('connect-livereload')());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
