/**
 * Task watch
 * @info on file update, this watch runs the rewatch task for that file type
 */
var gulp =  require('gulp'),
  config = require('../../../../../config.json'),
  gutil =  require('gulp-util'),
  runSequence =  require('run-sequence');

module.exports = {
  fn: function () {
    setTimeout(function () {
      gutil.log("auto watching build side files, no worries mates! (timeout-expired)");
      // gulp.watch(config.paths.pub, function(file){
      //   gutil.log("pub side - any file in the pub path, attempting reloading server");
      //   runSequence('notifyReloadServer');
      // });
      gulp.watch([config.paths.assets + 'js/**/*.js',config.paths.assets + 'js/**/*.coffee'], function(){
        gutil.log("buildout js or coffee - check for client side action");
        runSequence('client-js');
      });
      gulp.watch(config.paths.assets + 'scss/**/*.scss', function () {
        gutil.log("buildout scss - check for client side action");
        runSequence('process-css');
        //   runSequence('lintcopy-jade');
      });
      gulp.watch('index.js', runSequence('notifyReloadServer')); //restart server
    }, 1000);
  }
};
