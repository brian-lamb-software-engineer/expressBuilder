/**
 * Task jade stuff
 * output user message
 */
var gulp =      require('gulp');
var jade =      require('gulp-jade');
var jadelint =  require('gulp-jadelint');
var config =    require('../../../../../config.json');

/**
 * Task lintcopy-jade
 */
gulp.task('lintcopy-jade', ['notifyReadyServe'], function() {
  return gulp.src(config.paths.jade + '**/*.jade')
    .pipe(jadelint())
    .pipe(gulp.dest(config.paths.pub + 'views/'));
});

/**
 * Task jadecompile
 * @todo
 */
gulp.task('jadecompile', function() {
  return gulp.src(config.paths.jade + '**/*.jade')
    .pipe(jadelint())
    .pipe(jade({
      client: true
    }))
    .pipe(rename(function(path){
      path.extname = ".jade";
    }))
    .pipe(gulp.dest(config.paths.pub + 'views/'));
    //.pipe( livereload( {start:true, port:35730} ));
});
