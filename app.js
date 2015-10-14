/**
 * @info: Node server, using Express framework and Mongoose ODM which http
 * host's a SOA RESTful API
 * @info: helpful into; https://en.wikipedia.org/wiki/Service-oriented_architecture
 * @info: helpful into; https://en.wikipedia.org/wiki/Representational_state_transfer
 * @info: helpful into; https://www.airpair.com/javascript/complete-expressjs-nodejs-mongodb-crud-skeleton#generate-the-express-js-skeleton
 */
var express =   require('express'),
  path =        require('path'),
  favicon =     require('serve-favicon'),
  logger =      require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser =  require('body-parser'),
  compression = require('compression'),
  sass =        require('node-sass'),
  bootstrap =   require('express-bootstrap-service'),
  routes =      require('./www/js/controller_index'),
  db =          require('./www/js/model_db'),
  movies =      require('./www/js/controller_movies'),
  movie =       require('./www/js/model_movies'),
  blobs =       require('./www/js/controller_blobs'),
  blob =        require('./www/js/model_blobs'),
  app = express();

/**
 * app.set
 */
app.set('views', path.join(__dirname, 'www/views'));
app.set('view engine', 'jade');

/**
 * app.use
 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());

app.use(bootstrap.serve);
bootstrap.init({
    minified: false
});

app.use(require('connect-livereload')({
    port: 35729,
    src: 'http://192.168.1.10:35729/livereload.js?snipver=1'
}));

app.use(express.static('www'));
app.use('/', routes);  //Note, ALL use statements can point to '/' instead for SPA (look at res.redirect's)
//app.use('/users', users);
app.use('/blobs', blobs); // Blobs CRUD
app.use('/movies', movies); // Movies CRUD
app.use("/css", express.static(__dirname + '/css')); //assets
app.use("/js", express.static(__dirname + '/js')); //assets
app.use("/images", express.static(__dirname + '/images')); //assets

// uncomment following after placing your favicon in /www
//app.use(favicon(path.join(__dirname, 'www', 'favicon.ico')));

/**
 * Error handlers
 */
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
