/**
 * Task compile-vendors
 */
var gulp =  require('gulp');

gulp.task('compile-vendors', ['vendor-fontawesome', 'vendor-bootstrap',
  'vendor-jquery']);
