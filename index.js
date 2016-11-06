/*****************
 * expressBuilder *
 ******************
 *
 * A complete Express based web stack scaffold and development toolkit.
 *
 * @resource https://nodejs.org/
 * @resource http://expressjs.com/
 * @resource http://www.mongodb.org/
 * @resource http://mongoosejs.com/
 * @resource http://jade-lang.com/
 * @resource http://gulpjs.com/
 * @resource: https://en.wikipedia.org/wiki/Service-oriented_architecture
 * @resource: https://en.wikipedia.org/wiki/Representational_state_transfer
 * @resource: https://github.com/madhums/node-express-mongoose-demo
 * @resource: http://jasmine.github.io/2.2/introduction.html
 *
 * @ todo documentor for api
 * @ todo unit test library vendor example
 * @ todo ssl http://www.hacksparrow.com/express-js-https.html

 error database
 --------------
when starting server, client-js task, an error;
 throw
 ^
      (this error was related to a missing require, in this case was a typo)
 *
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
  routes =      require('./www/js/indexController'),
  db =          require('./www/js/dbMongoose'),
  //db =          require('./www/js/dbSequelize'),
  movies =      require('./www/js/movieController'),
  movie =       require('./www/js/movieModel'),
  blobs =       require('./www/js/blobController'),
  blob =        require('./www/js/blobModel'),
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
    port: 35730,
    src: 'http://192.168.1.10:35730/livereload.js?snipver=1'
}));

app.use(express.static('www'));

//some security
app.all('/*', function(req, res, next) {
  // CORS
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
// app.all('/api/v1/*', [require('./js/validateRequestService')]);

app.use('/', routes);  //Note, ALL use statements can point to '/' instead for SPA (look at res.redirect's)
//app.use('/users', users);
app.use('/blobs', blobs); // Blobs CRUD
app.use('/movies', movies); // Movies CRUD
app.use("/css", express.static(__dirname + '/css')); //assets
app.use("/js", express.static(__dirname + '/js')); //assets
app.use("/images", express.static(__dirname + '/images')); //assets
app.use("/fonts", express.static(__dirname + '/fonts')); //assets

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