/**
 * Task clean
 * one of our nicest tasks, deletes out old files, to keep a clean slate each
 * build
 */
 var gulp = require('gulp'),
  del = require('del'),
  file = require('gulp-file'),
  config = require('../../../../../config.json');

/**
 * Task clean
 * used in develop and watch
 */
gulp.task('clean', function(cb){
  del(config.paths.del); //all app output is built here, so clean-slate it..
  setTimeout(function () {
    //
    file('dummy.js', 'var = dummy = {a:3};', { src: true })
        .pipe(gulp.dest(config.paths.vendor))
        cb();
      //return cb();
  }, 5000);
});
