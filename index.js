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

 erreoneous error database
 --------------------------
when starting server, client-js task, an error;
 throw
 ^
      (this error was related to a missing require, in this case was a typo)
 *
 * ENOENT
 // DEBUG FUNCTION, UNCOMMENT WHEN YOU SEE ENOENT or other errors, to find the
 // backtrace(normally at the top of the output is the valuable portion).
 //
  // (function() {
  //     var childProcess = require("child_process");
  //     var oldSpawn = childProcess.spawn;
  //     function mySpawn() {
  //         console.log('spawn called');
  //         console.log(arguments);
  //         var result = oldSpawn.apply(this, arguments);
  //         return result;
  //     }
  //     childProcess.spawn = mySpawn;
  // })();
*/

var express =     require('express');
var path =        require('path');
var favicon =     require('serve-favicon');
var logger =      require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser =  require('body-parser');
var compression = require('compression');
var sass =        require('node-sass');
var bootstrap =   require('express-bootstrap-service');
var db =          require('./www/js/dbMongoose');
//var db =        require('./www/js/dbSequelize');
var Promise =     require("bluebird");
var app =         express();

var movies =      require('./www/js/movieController');
var blobs =       require('./www/js/blobController');
var students =    require('./www/js/studentController');
//leave after MODELS, or will get error Schema hasn't been registered for model
var routes =      require('./www/js/indexController');

app.set('views', path.join(__dirname, 'www/views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(bootstrap.serve);
bootstrap.init({ minified: false });
app.use(require('connect-livereload')({
    port: 35729,
    src: 'http://192.168.1.10:35729/livereload.js?snipver=1'
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

// load the router modules to open request handling
app.use('/', routes);  //Note, ALL use statements can point to '/' instead for SPA (look at res.redirect's)
//app.use('/users', users);
app.use('/blobs', blobs);
app.use('/movies', movies);
app.use('/students', students);

//assets
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
