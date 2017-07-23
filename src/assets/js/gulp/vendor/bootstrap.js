/**
 * Task vendor item
 * output user message
 */
var gulp =    require('gulp');
var concat =  require('gulp-concat');
var merge =   require('merge-stream');

/**
 * Task vendor-bootstrap for bootstrap-sass (npm)
 * THis vendor copy takes things to the next level.  Since there is multiple file
 * types being worked with here, there is an entry for each type, and each has
 * its own separate copy execution, one of which does some further processing
 * before outputting, then finally using merge to execute all at once, by
 * convenience.
 */
gulp.task('vendor-bootstrap', function(){

  // //bs3 js
  // var bootstrap3Js = gulp.src([
  //   // './node_modules/bootstrap-sass/assets/javascripts/bootstrap-sprockets.js'
  //   // './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'
  //   './node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js'
  //   ])
  //   .pipe(concat('bootstrap.custom.js'))
  //   .pipe(gulp.dest(gulp.config.paths.vendor + 'bootstrap3'));

  // bs3 sass do this a different way, we need all, so at complie time we have all our includes
  // var bootstrap3Css = gulp.src(['./node_modules/bootstrap-sass/assets/stylesheets/**/*'])
  //   .pipe(gulp.dest(gulp.config.paths.vendor + 'bootstrap3/scss/'));

  // bs3 fonts
  var vendorCopyBs3Fonts = gulp.src('./node_modules/bootstrap-sass/assets/fonts/bootstrap/glyph*.*')
    .pipe(gulp.dest(gulp.config.paths.vendor + 'bootstrap3/fonts/'));

  // var bootstrapImages = gulp.src(['./node_modules/bootstrap-sass/assets/images'])
    // .pipe(gulp.dest(gulp.config.paths.vendor + 'bootstrap/images/'));
  //return merge(bootstrap3Js, bootstrap3Css, vendorCopyBs3Fonts);

  //bs4 js
  // var bootstrap4Js = gulp.src(['./node_modules/bootstrap/js/dist/**/*'])
  var bootstrap4Js = gulp.src(['./node_modules/bootstrap/dist/js/bootstrap.min.js'])
    .pipe(concat('bootstrap.min.js'))
    .pipe(gulp.dest(gulp.config.paths.vendor + 'bootstrap4'));

  // bs4 sass do this a different way, we need all, so at complie time we have all our includes
  var bootstrap4Css = gulp.src(['./node_modules/bootstrap/scss/**/*'])
    .pipe(gulp.dest(gulp.config.paths.vendor + 'bootstrap4/scss/'));

  // var4 bootstrapImages = gulp.src(['./node_modules/bootstrap-sass/assets/images'])
    // .pipe(gulp.dest(gulp.config.paths.vendor + 'bootstrap/images/'));
  //return merge(bootstrap4Js, bootstrap4Css, vendorCopyBs3Fonts);
});
