/**
 * Task fonts stuff
 * takes care of any font processing,
 */
var gulp  = require('gulp');
var merge = require('merge-stream');

/**
 * Task process-fonts
 */
gulp.task('process-fonts', function(){
  var faVendorFonts = gulp.src(gulp.config.paths.vendor + 'font-awesome/fonts/*');
  var bsVendorFonts = gulp.src(gulp.config.paths.vendor + 'bootstrap/fonts/*');
  return merge(faVendorFonts,bsVendorFonts)
    .pipe(gulp.dest(gulp.config.paths.pub + 'fonts/'));
});
