/**
 * Task fonts stuff
 * takes care of any font processing,
 */
var gulp =  require('gulp'),
gutil =         require('gulp-util'),
runSequence =  require('run-sequence');

/**
 * Task all
 * @info run this task when you want to immediately run a file fix, during
 * development.  Alternatively, you can just run the following on the command
 * line:
 * $ gulp compile-vendors; gulp build; gulp develop
 * That command renders this task uneneeded.  Boils down to preference.
 */
gulp.task('all', function(){
      gutil.log('Running all task');
    return runSequence('compile-vendors', 'build', 'develop');
});
