/**
 * Task css stuff
 * handles all css compling, etc.
 */
var gulp =      require('gulp');
var sass =      require('gulp-sass');
var merge =     require('merge-stream');
var order =     require("gulp-order");
var minifyCss = require('gulp-minify-css');
var concat =    require('gulp-concat');

/**
 * Task process-css
 * build and concat all sass, and css
 * @todo 	responsive includes per @media, and called via loader.scss
 */
gulp.task('process-css', function(){
    //order of inclusion doesnt work here for some reason, so instead just
    //import them in the order you need, on the files themselves.
    localScssPath = gulp.config.paths.assets + 'scss/styles.scss',
    localCssPath = [gulp.config.paths.assets + 'css/*.css'],
    outputCssName = 'styles.css';

  // sass to process, normally only local stuff, vendors can be @imported
  var localSass = gulp.src(localScssPath) //this is the one that contains the code we ant loaded LAST
    .pipe(sass().on('error', sass.logError));

  // css to process, normally local, vendors can be imported
  var localCss = gulp.src(localCssPath);

  // run it
  return merge(localCss, localSass) //this order was NOT working, so had to install gulp-order for this alone
    .pipe(order([
      gulp.config.paths.assets + localCssPath,
      gulp.config.paths.assets + localScssPath //this is the one that contains the code we ant loaded LAST
    ]))
    .pipe(concat(outputCssName))
    .pipe(minifyCss())
    .pipe(gulp.dest(gulp.config.paths.pub + 'css'));
});

/**
 * Task css
 * @info used in watch
 */
gulp.task('css',  function(){
  return gulp.src(gulp.config.paths.assets + 'css/')
    .pipe(concat('styles.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(gulp.config.paths.pub + 'css/'));
});
