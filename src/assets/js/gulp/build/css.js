/**
 * Task css stuff
 * handles all css compling, etc.
 */
 var gulp =  require('gulp'),
  sass =          require('gulp-sass'),
  merge =         require('merge-stream'),
  order =         require("gulp-order"),
  minifyCss =     require('gulp-minify-css'),
  concat =        require('gulp-concat'),
  config = require('../../../../../config.json');

/**
 * Task process-css
 * build and concat all sass, and css
 * @todo 	responsive includes per @media, and called via loader.scss
 */
gulp.task('process-css', function(){
    localScssPath = [
      config.paths.assets + 'scss/styles.scss',
      config.paths.assets + 'scss/media-overrides.scss'],
    localCssPath = [config.paths.assets + 'css/*.css'],
    outputCssName = 'styles.css';

  // sass to process, normally only local stuff, vendors can be @imported
  var localSass = gulp.src(localScssPath) //this is the one that contains the code we ant loaded LAST
    .pipe(sass().on('error', sass.logError));

  // css to process, normally local, vendors can be imported
  var localCss = gulp.src(localCssPath);

  // run it
  return merge(localCss, localSass) //this order was NOT working, so had to install gulp-order for this alone
    .pipe(order([
      config.paths.assets + localCssPath,
      config.paths.assets + localScssPath //this is the one that contains the code we ant loaded LAST
    ]))
    .pipe(concat(outputCssName))
    .pipe(minifyCss())
    .pipe(gulp.dest(config.paths.pub + 'css'));
});

/**
 * Task css
 * @info used in watch
 */
gulp.task('css',  function(){
  return gulp.src(config.paths.assets + 'css/')
    .pipe(concat('styles.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(config.paths.pub + 'css/'));
});
