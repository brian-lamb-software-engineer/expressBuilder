// https://www.airpair.com/javascript/complete-expressjs-nodejs-mongodb-crud-skeleton#generate-the-express-js-skeleton
var express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  sass = require('node-sass'),
  bootstrap = require('express-bootstrap-service'),
  db = require('./js/model_db'),
  blob = require('./js/model_blobs'),
  routes = require('./js/controller_index'),
  blobs = require('./js/controller_blobs');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(favicon(path.join(__dirname, 'www', 'favicon.ico'))); // uncomment after placing your favicon in /www
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bootstrap.serve);
bootstrap.init({
    minified: false
});
app.use(require('connect-livereload')( // //you won't need 'connect-livereload' if you have livereload plugin for your browser
  {
    port: 35729,
    src: 'http://192.168.1.10:35729/livereload.js?snipver=1'
  }
));
app.use(express.static('public'));

//routes
app.use('/', routes);
// app.use('/users', users);
app.use('/blobs', blobs); //can point to / instead for SPA (look at res.redirect's)
app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));

app.use(function(req, res, next) { // catch 404 and forward to error handler
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') { // development error handler, will print stacktrace
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) { // production error handler, no stacktraces leaked to user
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
