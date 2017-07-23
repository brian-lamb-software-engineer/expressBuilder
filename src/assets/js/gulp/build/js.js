/**
 * Task js stuff
 * output user message
 */
 var gulp =  require('gulp'),
  config = require('../../../../../config.json'),
  rename =        require('gulp-rename'),
  gutil =         require('gulp-util'),
  jshint =        require('gulp-jshint'),
  concat =        require('gulp-concat'),
  merge =         require('merge-stream'),
  uglify =        require('gulp-uglify'),
  jasmine =       require('gulp-jasmine'),
  coffee =        require('gulp-coffee');

/**
 * Task coffee-js
 */
gulp.task('coffee-js', function(){
  return gulp.src(
      config.paths.assets + 'js/**/*.coffee'
    )
    .pipe(coffee({bare:true}).on('error', gutil.log))
    .pipe(rename(function (path) {
      path.extname = ".cfe.js"
    }))
    .pipe(gulp.dest(
        config.paths.assets + 'js/'
      ));
})

/**
 * Task client-js
 * These are the js source files for the full client-side of your web application.
 */
gulp.task('client-js', ['coffee-js'], function(){

  // models, loaded separatelys per route
  var jsModels = gulp.src(
      config.paths.models + '*.js'
    )
    .pipe(jshint())
    .pipe(uglify())
    .pipe(gulp.dest(
        config.paths.pub + 'js/'
      ));

  // services, loaded separately
  var jsServices = gulp.src(
      config.paths.services + '*.js'
    )
    .pipe(jshint())
    .pipe(uglify())
    .pipe(gulp.dest(
        config.paths.pub + 'js/'
      ));

  // controllers, loaded separately from routing
  var jsControllers = gulp.src(
    config.paths.controllers + '*.js'
    )
    .pipe(jshint())
    //.pipe(uglify()) //breaks, why?
    .pipe(gulp.dest(
        config.paths.pub + 'js/'
      ));

  // head js, inject your scripts here
  var srcHeadJs = gulp.src([
      config.paths.services + 'browserDetect.js',
      config.paths.vendor + 'jquery/jquery-custom.js',
      // config.paths.vendor + 'bootstrap3/bootstrap.custom.js',
      config.paths.vendor + 'bootstrap4/bootstrap.min.js',
      config.paths.assets + 'js/appModule.cfe.js'
    ])
    .pipe(jshint())
    .pipe(concat('~srcHead.js'))
    .pipe(gulp.dest(
      config.paths.tmp
    ));

  // vendor belonging in head, inject your vendors here
  var vendorHeadJs = gulp.src(config.paths.vendor + 'js/dummy.js')
    .pipe(jshint())
    .pipe(concat('~vendorHead.js'))
    .pipe(gulp.dest(
      config.paths.tmp
    ));

  // load this file only on your template head
  var pubJsHead = merge(vendorHeadJs,srcHeadJs)
    //jshinting VENDORS here
    .pipe(jshint())
    .pipe(concat('head.js'))
    .pipe(uglify()) // TRY NOT TO UGLIFY VENDORS, instead, use minified version
    .pipe(gulp.dest(
      config.paths.pub + 'js/'
    ));

  // foot js, inject your scripts here
  var srcFootJs = gulp.src([
    /**
      * JAVASCRIPT INCLUSION HERE
      * add your foot javascript here (this should be most of your js)
      */
      config.paths.assets + 'js/dummy.js',
    ])
    .pipe(jshint())
    .pipe(concat('~srcFoot.js'))
    .pipe(gulp.dest(
      config.paths.tmp
    ));

  //vendors which can be postponed to the foot, inject your vendors here
  var vendorFootJs = gulp.src([
      config.paths.assets + 'js/dummy.js',
  ])
    .pipe(jshint())
    .pipe(concat('~vendorFoot.js'))
    .pipe(gulp.dest(
      config.paths.tmp
    ));

  //output file, load this file only in your foot
  var pubJsFoot = merge(vendorFootJs, srcFootJs)
    // .pipe(order(vendorFootJs))
    .pipe(concat('foot.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(
      config.paths.pub + 'js/'
    ));
  // run
  // @ TODO, check why if pubJsFoot has merge command above, that its included below in teh merge again
  return merge(jsServices, jsControllers, jsModels, srcHeadJs, vendorHeadJs, srcFootJs,
      vendorFootJs, pubJsHead, pubJsFoot);
});

/**
 * Task lint-js
 */
gulp.task('lint-js', function(){
  return gulp.src([
      config.paths.src + '**.*.js',
      '*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jasmine-tests', function () {
    return gulp.src(
        config.paths.tests + 'tests.js'
      )
        .pipe(jasmine());
});
