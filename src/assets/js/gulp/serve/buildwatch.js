/**
 * Task watch
 * @info on file update, this watch runs the rewatch task for that file type
 */
var gulp =          require('gulp');
var config =        require('../../../../../config.json');
var gutil =         require('gulp-util');
var runSequence =  require('run-sequence');

module.exports = {
  fn: function () {
    setTimeout(function () {
      gutil.log("auto watching build side files, no worries mates! (timeout-expired)");
      // gulp.watch(config.paths.pub, function(file){ });

      //watch src js assets, including coffee scripts, AND controllers
      gulp.watch([
          config.paths.assets + 'js/**/*.js',
          config.paths.assets + 'js/**/*.coffee',
          config.paths.controllers + '*.js'], function(file){ //some reason **/*.js isnt working here
        gutil.log("buildout all src js and coffee - check for client side action");
        runSequence('client-js');
      });

      //watch src sass assets
      gulp.watch(config.paths.assets + 'scss/**/*.scss', function () {
        gutil.log("buildout scss - check for client side action");
        runSequence('process-css');
        //   runSequence('lintcopy-jade');
      });

      //watch src jade template assets
      gulp.watch(config.paths.jade + '**/*.jade', function () {
        gutil.log("buildout jade - check for client side action");
        runSequence('lintcopy-jade');
      });
    }, 1000);
  }
};
