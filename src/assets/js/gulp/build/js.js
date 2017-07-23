/**
 * Task js stuff
 * tasks on this file will normally just need to re-run build & develop tasks,
 * and not need a vendor recompile.
 *
 * To add vendors from /node_modules, first npm-install something, then create
 *  a new gulp/vendor task file to get the files into the /vendor dir, add that
 *  task to gulp/vendor/compile.js, then add the compiled file to one of the
 *  methods below to apply it.  e.g. to srcHeadJs if a js file
 */
 var gulp =     require('gulp');
 var rename =   require('gulp-rename');
 var gutil =    require('gulp-util');
 var jshint =   require('gulp-jshint');
 var concat =   require('gulp-concat');
 var merge =    require('merge-stream');
 var uglify =   require('gulp-uglify');
 var jasmine =  require('gulp-jasmine');
 var coffee =   require('gulp-coffee');

/**
 * Task coffee-js
 */
gulp.task('coffee-js', function(){
  return gulp.src(
      gulp.config.paths.assets + 'js/**/*.coffee'
    )
    .pipe(coffee({bare:true}).on('error', gutil.log))
    .pipe(rename(function (path) {
      path.extname = ".cfe.js"
    }))
    .pipe(gulp.dest(
        gulp.config.paths.assets + 'js/'
      ));
})

/**
 * Task client-js
 * These are the js source files for the full client-side of your web application.
 */
gulp.task('client-js', ['coffee-js'], function(){

  // models, loaded separatelys per route
  var jsModels = gulp.src(
      gulp.config.paths.models + '*.js'
    )
    .pipe(jshint())
    .pipe(uglify())
    .pipe(gulp.dest(
        gulp.config.paths.pub + 'js/'
      ));

  // services, loaded separately
  var jsServices = gulp.src(
      gulp.config.paths.services + '*.js'
    )
    .pipe(jshint())
    .pipe(uglify())
    .pipe(gulp.dest(
        gulp.config.paths.pub + 'js/'
      ));

  // controllers, loaded separately from routing
  var jsControllers = gulp.src(
    gulp.config.paths.controllers + '*.js'
    )
    .pipe(jshint())
    //.pipe(uglify()) //breaks, why?
    .pipe(gulp.dest(
        gulp.config.paths.pub + 'js/'
      ));

  // head js, inject your scripts here
  // gulp.config.paths.vendor   + 'bootstrap/bootstrap.custom.js',
  var srcHeadJs = gulp.src([
      gulp.config.paths.services + 'browserDetect.js',
      gulp.config.paths.vendor   + 'jquery/jquery-custom.js',
      gulp.config.paths.vendor   + 'bootstrap4/bootstrap.min.js',
      gulp.config.paths.assets   + 'js/appModule.cfe.js',
      gulp.config.paths.vendor   + 'tether/tether.min.js',
      gulp.config.paths.assets   + 'js/appModule.cfe.js'
    ])
    .pipe(jshint())
    .pipe(concat('~srcHead.js'))
    .pipe(gulp.dest(
      gulp.config.paths.tmp
    ));

  // vendor belonging in head, inject your vendors here
  var vendorHeadJs = gulp.src(gulp.config.paths.vendor + 'js/dummy.js')
    .pipe(jshint())
    .pipe(concat('~vendorHead.js'))
    .pipe(gulp.dest(
      gulp.config.paths.tmp
    ));

  // load this file only on your template head
  var pubJsHead = merge(vendorHeadJs,srcHeadJs)
    //jshinting VENDORS here
    .pipe(jshint())
    .pipe(concat('head.js'))
    .pipe(uglify()) // TRY NOT TO UGLIFY VENDORS, instead, use minified version
    .pipe(gulp.dest(
      gulp.config.paths.pub + 'js/'
    ));

  // foot js, inject your scripts here
  var srcFootJs = gulp.src([
    /**
      * JAVASCRIPT INCLUSION HERE
      * add your foot javascript here (this should be most of your js)
      */
      gulp.config.paths.assets + 'js/dummy.js',
    ])
    .pipe(jshint())
    .pipe(concat('~srcFoot.js'))
    .pipe(gulp.dest(
      gulp.config.paths.tmp
    ));

  //vendors which can be postponed to the foot, inject your vendors here
  var vendorFootJs = gulp.src([
      gulp.config.paths.assets + 'js/dummy.js',
  ])
    .pipe(jshint())
    .pipe(concat('~vendorFoot.js'))
    .pipe(gulp.dest(
      gulp.config.paths.tmp
    ));

  //output file, load this file only in your foot
  var pubJsFoot = merge(vendorFootJs, srcFootJs)
    // .pipe(order(vendorFootJs))
    .pipe(concat('foot.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(
      gulp.config.paths.pub + 'js/'
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
      gulp.config.paths.src + '**.*.js',
      '*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jasmine-tests', function () {
    return gulp.src(
        gulp.config.paths.tests + 'tests.js'
      )
        .pipe(jasmine());
});
