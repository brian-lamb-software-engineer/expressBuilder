/**
 * GULP
 * ----
 * movie-site task runner
 * what do we want gulp to do today folks?
 * good info - https://gist.github.com/hansent/9417349
 *
 * Parent Task list
 * ----------------
 * -default         (runs both build and develop)
 * -build           (builds src into www, ready to be served)
 * -develop         (Includes watch, and loads server)
 * -compile-vendors (one off command needed only after adjustment of vendor/sources)
 *
 * Include gulp, and plugins
 */
var paths = {
  vendor:     './vendor/',
  src:        './src/',
  appjs:      './app.js',
  models:     './src/models/*.js',
  controllers:'./src/controllers/*.js',
  jade:      ['./src/views/**/*.jade'],
  images:     ['./src/assets/images/**/*.jpg', './**/*.png'],
  scss:       './src/assets/scss/**/*.scss',
  css:        './src/assets/*.css',
  pub:        './www/',
  del:       [
              './www/js/*.js', //all js (recompiled via gulp)
              './www/css/*.css', //all css (recompiled via gulp)
              './www/v_*', //the version tag (recreated via gulp)
            ]
  },
  gulp = require('gulp'),
  express = require('express'),
  gutil = require('gulp-util'),
  gls = require('gulp-live-server'),
  file = require('gulp-file'),
  del = require('del'),
  rename = require('gulp-rename'),
  merge = require('merge-stream'),
  concat = require('gulp-concat'),
  minifyCss = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  livereload = require('gulp-livereload'), //https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
  jshint = require('gulp-jshint'),
  jquery = require('gulp-jquery'),
  sass = require('gulp-sass'),
  jade = require('gulp-jade'),
  jadelint = require('gulp-jadelint');

/**
 * Task default
 */
gulp.task('default', ['develop', 'build']);

/**
 * Task build
 */
gulp.task('build', ['server-js', 'client-js', 'process-css', 'jadepub', 'add-version-tag']);

gulp.task('server-js', ['clean'], function(){
  return gulp.src(paths.appjs)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('client-js', ['clean'], function(){
  var buildControllerjs = gulp.src(paths.controllers)
    .pipe(rename({dirname: '', prefix: 'controller_'}))
    .pipe(uglify())
    .pipe(gulp.dest(paths.pub + 'js/'));
  var buildModeljs = gulp.src(paths.models)
    .pipe(rename({dirname: '', prefix: 'model_'}))
    .pipe(uglify())
    .pipe(gulp.dest(paths.pub + 'js/'));
  var vendorjs = gulp.src([
      './vendor/jquery/jquery.custom.js',
      './vendor/bootstrap/bootstrap.custom.js'])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.pub + 'js/'));
  return merge(vendorjs, buildControllerjs, buildModeljs);
});

gulp.task('process-css', function(){
  var scss = gulp.src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('~styles.css'))
    .pipe(gulp.dest('/tmp'));
  //this one is the output, if your adding more css, add it above this one for ease
  var css = gulp.src([paths.css, '/tmp/~styles.css'])
    .pipe(concat('styles.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.pub + 'css/'));
  return merge(scss, css);
});

gulp.task('jadepub', function() {
  return gulp.src(paths.jade)
    .pipe(jadelint())
    .pipe(gulp.dest(paths.pub + 'views/'));
});

gulp.task('add-version-tag', ['clean'], function(cb){
  dateIs = new Date(),
  dateStrIs = dateIs.toString(),
  nameStrIs = dateIs.getUTCMonth() + 1 + '_' + dateIs.getUTCDate() + '_' +
    dateIs.getUTCHours() + '_' + dateIs.getMinutes();
   file('v_' + nameStrIs, 'Gulped! \n' + dateStrIs) //make a new version tag, for the tag gun
      .pipe(gulp.dest(paths.pub)); //apply the sticker..
  return cb();
});

/**
 * Task develop
 */
gulp.task('develop', ['lint-js', 'gls', 'watch']);

gulp.task('lint-js', function(){
  return gulp.src([paths.src + '**.*.js', '*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('gls', function(){
  setTimeout(function () {
    gutil.log('Gls Server Starting http://192.168.1.10:3000');
    var server = gls.new('bin/www');
    server.start();
    gulp.watch(paths.pub + 'css/*.css', function(file){
      server.notify.apply(server, [file]);
    });
    gulp.watch(paths.pub + 'views/**/*.jade', function(file){
      server.notify.apply(server, [file]);
    });
    gulp.watch(paths.pub + '**/*.js', server.start.bind(server));
  }, 20000);
 });

gulp.task('watch', function(){
  setTimeout(function () {
    gulp.watch(paths.pub + 'js/', ['rewatch-js']);
    gulp.watch(paths.controllers, ['rewatch-js']);
    gulp.watch(paths.models, ['rewatch-js']);
    gulp.watch(paths.jade, ['rewatch-jade']);
    gulp.watch([paths.scss, paths.css], ['rewatch-css']);
  }, 20000);
});

gulp.task('rewatch-js', ['lint-js', 'client-js'] );
gulp.task('rewatch-css', ['process-css'] );
gulp.task('rewatch-jade', ['jadepub'] );

/**
 * Task compile-vendors
 */
gulp.task('compile-vendors', ['vendor-bootstrap', 'vendor-jquery', 'vendor-fontawesome']);

gulp.task('vendor-jquery', function(){
  return gulp.src('./node_modules/jquery/src')
  .pipe(jquery({
    release: 1,
    flags: ['-deprecated', '-event/alias', '-ajax/script', '-ajax/jsonp', '-exports/global']
  }))
  .pipe(gulp.dest('./vendor/jquery/')); // creates jquery.custom.js (unminified)
});

gulp.task('vendor-fontawesome', function(){
  //copy entire src to recompile later after a variables.custom.scss is added
  return gulp
    .src('./node_modules/font-awesome/')
    .pipe(gulp.dest('./vendor/font-awesome/'));
  // var fonts = gulp.src('./node_modules/font-awesome/fonts/*')
  //   .pipe(gulp.dest(paths.vendor + 'font-awesome/fonts/'));
  // return merge(scss, fonts);
});

gulp.task('vendor-bootstrap', function(){
  var bootstrapJs = gulp.src([
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap-sprockets.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'
    ])
    .pipe(concat('bootstrap.custom.js'))
    .pipe(gulp.dest('./vendor/bootstrap/'));
  var bootstrapCss = gulp.src([
    './node_modules/bootstrap-sass/assets/stylesheets/_bootstrap-sprockets.scss',
    './node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss'
    ])
    .pipe(concat('bootstrap.custom.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./vendor/bootstrap/'));
  var bootstrapFonts = gulp.src('./node_modules/bootstrap-sass/assets/fonts/bootstrap/glyph*.*')
    .pipe(gulp.dest('./vendor/bootstrap/fonts'));
  // var bootstrapImages = gulp.src(['./node_modules/bootstrap-sass/assets/images'])
    // .pipe(gulp.dest('.//vendor/bootstrap/images/'));
  return merge(bootstrapJs, bootstrapCss, bootstrapFonts);
});

/**
 * Support Tasks
 */
 //used in develop and watch
gulp.task('clean', function(cb){
  del(paths.del); //all app output is built here, so clean-slate it..
  setTimeout(function () {
    return cb();
  }, 7000);
});

//used in watch
gulp.task('css',  function(){
  return gulp.src(paths.css)
    .pipe(concat('styles.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.pub + 'css/'));
});

// @todo
gulp.task('jadecompile', function() {
  return gulp.src(paths.jade)
    .pipe(jadelint())
    .pipe(jade({
      client: true
    }))
    .pipe(rename(function(path){
      path.extname = ".jade";
    }))
    .pipe(gulp.dest(paths.pub + 'views/'));
    //.pipe( livereload( server ));
});
