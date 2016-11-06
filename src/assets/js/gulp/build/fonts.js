/**
 * Task fonts stuff
 * takes care of any font processing,
 */
 var gulp =  require('gulp'),
  merge =         require('merge-stream'),
  config = require('../../../../../config.json');

/**
 * Task process-fonts
 */
gulp.task('process-fonts', function(){
  var faVendorFonts = gulp.src(config.paths.vendor + 'font-awesome/fonts/*');
  var bsVendorFonts = gulp.src(config.paths.vendor + 'bootstrap/fonts/*');
  return merge(faVendorFonts,bsVendorFonts)
    .pipe(gulp.dest(config.paths.pub + 'fonts/'));
});
