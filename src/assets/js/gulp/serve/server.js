/**
 * Task server stuff, gls, watch, etc
 * output user message
 */
 // var server = [];
 var gulp =       require('gulp');
 // var config =     require('../../../../../config.json'); //deprecating in favor of below
 var config =     gulp.pathconfig;
 var jshint =     require('gulp-jshint');
 var gls =        require('gulp-live-server');
 var gutil =      require('gulp-util');
 var watch =      require('gulp-watch');
 var runSequence =  require('run-sequence');
 var file =        null;
 var os =          require("os");
 var hostname =  os.hostname();

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
   * note port of gulp-live-server is established here, since were using
   * new, we are setting the port on the script file, otherwise to get a
   * more custom setup, dont use new, just use gls, and add in config
   * here, etc..
   **/
   gutil.log('gls and nodemon starting, check for start next');
   var server = gls.new('bin/www');
   server.start('nodemon');
   gutil.log('gls and nodemon source watch started,');

   gutil.log('setting a watch on the pub files');
   setTimeout(function () {
    gutil.log('Livereload loaded');
    gutil.log('Make sure the following browser domain name is in your hosts file');
    gutil.log('or use the hosts ip instead!');
    gutil.log('...');
    gutil.log('Point your browser to http://' + hostname + ':' + gulp.appport);
    gutil.log('Bang away!');

    /**
     * note port of gulp live server is established here, since were using
     * new, we are setting the port on the script file, otherwise to get a
     * more custom setup, dont use new, just use gls, and add in config
     * here, etc..
     **/

     //watch built css, trigger live reload
    gulp.watch([config.paths.pub + 'css/**/*.css'], function(file){

        gutil.log('pub side - triggering server notify apply file ');

        //livereload
        server.notify.apply(server, [file]);
        gutil.log('clientside re-compress - check for browser response');
      });

    //watch built js, and views, trigger live reload
    gulp.watch([
        config.paths.pub + 'js/**/*.js',
        config.paths.pub + 'views/**/*.jade'
      ],
      function(file){
        gutil.log('pub side - triggering livereload');

        //livereload
        server.notify.apply(server, [file]);
        //server.stop.bind(server)
        //server.start.bind(server)
        //
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

 //NEW NODEMON EXAMPLE, COPY, DONT EDIT
 //http://stackoverflow.com/questions/23665993/gulp-js-livereload-with-express-server
 // gulp.task('serve', function (cb) {
 //     nodemon({
 //         script  : <server start file>,
 //         watch   : <server files>
 //         //...add nodeArgs: ['--debug=5858'] to debug
 //         //..or nodeArgs: ['--debug-brk=5858'] to debug at server start
 //     }).on('start', function () {
 //         setTimeout(function () {
 //             livereload.changed();
 //         }, 2000); // wait for the server to finish loading before restarting the browsers
 //     });
 // });
