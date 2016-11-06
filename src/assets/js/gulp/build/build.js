/**
 * Task build
 * builds out the www dir complete
 */
 var gulp =  require('gulp'),
    runSequence =   require('run-sequence'),
    gutil =         require('gulp-util'),
    config = require('../../../../../config.json');

/**
 * Task build
 * This runs tasks like compile, lint, and pre proccesing on all local
 * source files, and any needed ./vendor files, then outputs the web
 * application to the build dir in a working state. After the build,
 * either the develop task can be ran to launch a live reload server to
 * where the site becomes immediately available to a web browser or
 * alternatively the command 'npm start' can be ran to launch the apps
 * default server.
 */
gulp.task('build', function(callback){
    runSequence('clean', ['server-js', 'client-js', 'process-css', 'lintcopy-jade',
                'process-fonts', 'add-version-tag'],
                callback);
    gutil.log("When this build is complete momentarily, you can run the 'gulp " +
      "develop' task which will launch the server!");
});
