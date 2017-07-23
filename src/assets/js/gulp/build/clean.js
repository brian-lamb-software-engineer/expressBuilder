/**
 * Task clean
 * one of our nicest tasks, deletes out old files, to keep a clean slate each
 * build
 */
var gulp = require('gulp');
var del =  require('del');
var file = require('gulp-file');

/**
 * Task clean
 * used in develop and watch
 */
gulp.task('clean', function(cb){
  del(gulp.config.paths.del); //all app output is built here, so clean-slate it..
  setTimeout(function () {
    //
    file('dummy.js', 'var = dummy = {a:3};', { src: true })
        .pipe(gulp.dest(gulp.config.paths.vendor))
        cb();
      //return cb();
  }, 5000);
});
