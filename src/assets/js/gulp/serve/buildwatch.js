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
      //watch js assets, including coffee scripts, AND controllers source
      gulp.watch([
          config.paths.assets + 'js/**/*.js',
          config.paths.assets + 'js/**/*.coffee',
          config.paths.controllers + '*.js'], function(){ //some reason **/*.js isnt working here
        gutil.log("buildout all src js and coffee - check for client side action");
        return runSequence('client-js');
      });
      //watch sass assets
      gulp.watch(config.paths.assets + 'scss/**/*.scss', function () {
        gutil.log("buildout scss - check for client side action");
        return runSequence('process-css');
        //   runSequence('lintcopy-jade');
      });
      //watch jade template assets
      gulp.watch(config.paths.jade + '**/*.jade', function () {
        gutil.log("buildout jade - check for client side action");
        return runSequence('lintcopy-jade');
      });
      //watch main node server index.js app
      gulp.watch('index.js', function(){
        return runSequence('notifyReloadServer')
      }); //restart server
    }, 1000);
  }
};
