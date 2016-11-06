/**
 * Task vendor item
 * output user message
 */
 var gulp =  require('gulp'),
  fs = require('file-system'),
   gutil =         require('gulp-util'),
  config = require('../../../../../config.json');

/**
 * Task vendor-fontawesome
 * demonstrates how to check if file exists, before copying vendor files directly
 * from node_modules.  This is a one time deal.  It can be re-ran when either
 * new vendors are added here, or when you need a new copy of your vendors
 * loaded for whatever reason.
 */
gulp.task('vendor-fontawesome', function(){
  var faVarFileName = '_variables.scss',
    faVarFile = config.paths.vendor + 'font-awesome/scss/' + faVarFileName;

  // if fa custom var file exists dont overwrite it
  if(fs.existsSync(faVarFile)) {
    gutil.log('_variables.scss FOUND!  If you havent customized it, please look ' +
    ' at the variables and edit any accordingly if necessary, then re-run build');
  } else {
    gutil.log('_variables.scss NOT found, ok, will add new one.  Edit this ' +
    " new file now before running your build.  You can still safely recompile " +
     'any time.  It will NOT be overwritten on the next run.');
  }
  return gulp.src([
     './node_modules/font-awesome/**/*.scss', //e.g. to use /**/*.ext to output 1) output all dirnames filtered by only dirs that contains a specified filetype 2) and all files in thad dir, filtered by ext type .sass
    './node_modules/font-awesome/fonts**/*.*']) // e.g. to use /keyword**/* to output 1) a specified dirname, AND 2) and all files residing in it
    .pipe(gulp.dest(config.paths.vendor + 'font-awesome/'));
});
