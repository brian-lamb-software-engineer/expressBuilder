/**
 * Task server stuff, gls, watch, etc
 * output user message
 */
 var gulp =  require('gulp'),
    config = require('../../../../../config.json'),
    jshint =        require('gulp-jshint'),
    gls =           require('gulp-live-server'),
    gutil =         require('gulp-util'),
    watch = require('gulp-watch'),
    runSequence =  require('run-sequence'),
    server = [],
    file=null;

/**
 * Task server-js
 */
gulp.task('server-js', function(){
  return gulp.src(config.paths.packageroot)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Task gls
 */
gulp.task('gls', function(){

  /**
   * note port of gulp live server is established here, since were using
   * new, we are setting the port on the script file, otherwise to get a
   * more custom setup, dont use new, just use gls, and add in config
   * here, etc..
   **/
   gutil.log('gls starting, check for gls started next');
   server = gls.new('bin/www');

   server.start();
   gutil.log('gls started, setting a watch on the pub files');

   //gulp.watch(config.paths.pub + '*.js', server.start.bind(server));
   setTimeout(function () {

    gutil.log('LIVE RELOAD LOADED (timeout expired)');
    gutil.log('live reload actively watching for changes on the pub side.');
    gutil.log('Bang away!');

    /**
     * note port of gulp live server is established here, since were using
     * new, we are setting the port on the script file, otherwise to get a
     * more custom setup, dont use new, just use gls, and add in config
     * here, etc..
     **/
    gulp.watch([
         config.paths.pub + 'css/**/*.css',
         config.paths.pub + 'js/**/*.js',
         config.paths.pub + 'views/**/*.jade'
       ], function(file){

        gutil.log('pub side - triggering server notify apply file ');
        server.notify.apply(server, [file]);
        gutil.log('clientside re-compress - check for browser response');
      });

    gulp.watch(config.paths.pub + '*.js', function(){
      gutil.log('pub side - triggering server bind ');
      server.start.bind(server);
      gutil.log('client restart - check for browser response');
    }); //watch the server too
  }, 1500);
 });

 /**
  * Task notifyReadyServe
  */
 gulp.task('notifyReadyServe', function(){
     gutil.log('Notifying you, ready to serve!');
 });

 /**
  * Task notifyReloadServer
  */
 gulp.task('notifyReloadServer', function(){
     gutil.log('Notifying reload of server');
     server.start.bind(server);
 });
