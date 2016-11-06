/**
 * Task vendor item
 * output user message
 */
 var gulp =  require('gulp'),
  concat =        require('gulp-concat'),
  merge =         require('merge-stream'),
  config = require('../../../../../config.json');

/**
 * Task vendor-bootstrap
 * THis vendor copy takes things to the next level.  Since there is multiple file
 * types being worked with here, there is an entry for each type, and each has
 * its own separate copy execution, one of which does some further processing
 * before outputting, then finally using merge to execute all at once, by
 * convenience.
 */
gulp.task('vendor-bootstrap', function(){

  //bs js
  var bootstrapJs = gulp.src([
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap-sprockets.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'
    ])
    .pipe(concat('bootstrap.custom.js'))
    .pipe(gulp.dest(config.paths.vendor + 'bootstrap'));

  // bs sass do this a different way, we need all, so at complie time we have all our includes
  var bootstrapCss = gulp.src(['./node_modules/bootstrap-sass/assets/stylesheets/**/*'])
    .pipe(gulp.dest(config.paths.vendor + 'bootstrap/scss/'));

  // bs fonts
  var vendorCopyBsFonts = gulp.src('./node_modules/bootstrap-sass/assets/fonts/bootstrap/glyph*.*')
    .pipe(gulp.dest(config.paths.vendor + 'bootstrap/fonts/'));

  // var bootstrapImages = gulp.src(['./node_modules/bootstrap-sass/assets/images'])
    // .pipe(gulp.dest(config.paths.vendor + 'bootstrap/images/'));
  return merge(bootstrapJs, bootstrapCss, vendorCopyBsFonts);
});
