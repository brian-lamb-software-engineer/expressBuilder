/**
 * Task developf
 * BE CAREFUL, when this file was named gulp/develop.js, and the task was called
 *  as named, it wouldnt work.  when task was called as not named, e.g.
 *  go-develop, it worked then when file was named go-develp, it again wouldnt
 *  work.  So apparentl it doesnt like  this task in the gulp root folder,
 *  because the all task works fine i think in the gulp root folder.
 * Hence, it was placed in a subdir, now it works.
 *
 */
var gulp =  require('gulp'),
    gutil =         require('gulp-util'),
    runSequence =  require('run-sequence');

/**
 * Task develop
 */
gulp.task('develop', function(){
    gutil.log('Running Develop task.  This is the final needed task.  Get to work!');
    runSequence('jasmine-tests', 'lint-js', 'gls', 'serve:buildwatch');
});
