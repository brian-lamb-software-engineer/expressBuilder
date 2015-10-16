/*****************
 * expressBuilder *
 ******************
/**
 * GULP
 *
 * What do we want gulp to do today folks?
 *
   * Parent Task list
   * ----------------
   * -compile-vendors (sources node modules to vendor repo, a one off command
   *                  needed only after adjustment of vendor/sources)
   * -build           (builds src into www, sources and needed vendor to src, and
   *                  ready to be served)
   * -develop         (Includes watch, and loads server, and does not build or
                      compile)
   * -default         (runs develop only)
 *
 * Main usage commands:
 * $ gulp compile-vendors (processes specified vendor files from node_module
      sources, and outputs them to a ./vendor directory for use)
 * $ gulp build (deletes selected files in build dir(most if not all), compiles
      all source and assets, including any specified vendors, lints and uglifies
      all javascript, processes any sass, processes specified images, copies in
      specified fonts, minifies all css, outputs to the http hosted build dir)
 * $ gulp develop (or just gulp) (lints all js, including gulpfile and server
      app.js, then starts the live reload server for instant development updates
      for css, js, and templates, and starts a file watch on those files to
      trigger the reloads.  This server was set up so that you will not need the
      chrome live reload plugin for this setup, therefore this will work cross-
      browser on multiple browsers at the same time, all opened to various
      responsive sizes.  This delivers an ultimate development experience.)
 *
 * Alt commands:
 * $ gulp gls (to directly start live reload server, and watch)
 * $ npm start (which bypasses livereload server altogether, and starts a normal
 *   http server, without livereload features. run anytime after build complete)
 *
 * This setup is not constrained to using JADE as a template engine, or sass as
 * the main CSS pre processor, nor is it consrained to using jquery and bootstrap
 * or font-awesome.  You can remove these modules and replace them with your
 * favorite.
 *
 * Modernizr, Angular and maybe underscore will soon be added, but you
 * can choose ember, backbone, etc..  The current usage of Mongoose ODM will be
 * kept, but its current role doubling as the CRUD module may be mostly be
 * replaced by Angular, however, I plan to keep JADE for the template engine.
 *
 * A fresh breath of air!
 */

 /**
 * Include gulp, and plugins
 */
var paths = {
  packageroot:'./',
  src:        './src/',
  pub:        './www/', // the build dir
  vendor:     './vendor/',
  models:     './src/models/',
  controllers:'./src/controllers/',
  jade:       './src/views/',
  assets:     'src/public/',
  // the clean(delete) path's, mostly for build dir add whatever you want,
  // './www' works as a fell swoop.  you cant add the vendors to this or you will
  // end up having to mess with alot of things to accomodate since these paths
  // are used to construct them in the first place, and a re-build would have them
  // deleted before the build starts. so that dir is off limits moslty until
  // more logic is added.
  del:       [
              './www/css/',   // all css (recreated on build)
              './www/fonts/', // all fonts (recreated on build)
              './www/js/',    // all js (recreated on build)
              './www/views/', // all views (recreated on build)
              './www/v_*'    // the v_ersion tag (recreated on build)
            ]
  },
  gulp =          require('gulp'),
  express =       require('express'),
  fs =            require('fs'),
  runSequence =   require('run-sequence'),
  del =           require('del'),
  gutil =         require('gulp-util'),
  gls =           require('gulp-live-server'),
  file =          require('gulp-file'),
  rename =        require('gulp-rename'),
  merge =         require('merge-stream'),
  concat =        require('gulp-concat'),
  order =         require("gulp-order"),
  minifyCss =     require('gulp-minify-css'),
  uglify =        require('gulp-uglify'),
  livereload  =   require('gulp-livereload'), //https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
  jshint =        require('gulp-jshint'),
  sass =          require('gulp-sass'),
  jade =          require('gulp-jade'),
  jadelint =      require('gulp-jadelint'),
  jQueryBuilder = require('jquery-custom');

      /**
       * Task default
       */
gulp.task('default', ['develop']);

      /**
       * Task build
       * This runs tasks like compile, lint, and pre proccesing on all local
       * source files, and any needed ./vendor files, then outputs the web
       * application to the build dir in a working state. After the build,
       * either the develop task can be ran to launch a live reload server to
       * where the site becomes immediately available to a web browser.
       * Alternatively the command 'npm start' can be ran to launch the apps
       * default server.
       */
gulp.task('build', function(callback){
    runSequence('clean', ['server-js', 'client-js', 'process-css', 'lintcopy-jade',
                'process-fonts', 'add-version-tag'],
                callback);
    gutil.log("When this build is complete momentarily, you can run the 'gulp " +
      "develop' task which will launch the server!");
});

gulp.task('notifyReadyServe', function(){
    gutil.log('Notifying you, ready to serve!');
});


/**
 * Task server-js
 */
gulp.task('server-js', function(){
  return gulp.src(paths.packageroot)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Task client-js
 * These are the js source files for the full client-side of your web application.
 */
gulp.task('client-js', function(){
  // model modules
  var jsModels = gulp.src(paths.models + '*.js')
    .pipe(rename({dirname: '', prefix: 'model_'}))
    .pipe(jshint())
    .pipe(uglify())
    .pipe(gulp.dest(paths.pub + 'js/'));
  //controller modules
  var jsControllers = gulp.src(paths.controllers + '*.js')
    .pipe(rename({dirname: '', prefix: 'controller_'}))
    .pipe(jshint())
    .pipe(uglify())
    .pipe(gulp.dest(paths.pub + 'js/'));
  // head js
  var srcHeadJs = gulp.src([
      paths.vendor + 'jquery/jquery-custom.js',
      paths.vendor + 'bootstrap/bootstrap.custom.js'
  ])
    .pipe(jshint())
    .pipe(concat('~srcHead.js'))
    .pipe(gulp.dest('/tmp'));
  var vendorHeadJs = gulp.src(paths.vendor + 'js/dummy.js')
    .pipe(jshint())
    .pipe(concat('~vendorHead.js'))
    .pipe(gulp.dest('/tmp'));
  var pubJsHead = merge(vendorHeadJs,srcHeadJs)
    .pipe(jshint())
    .pipe(concat('head.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.pub + 'js/'));
  // foot js
  var srcFootJs = gulp.src([paths.assets + 'js/dummy.js'])
    .pipe(jshint())
    .pipe(concat('~srcFoot.js'))
    .pipe(gulp.dest('/tmp'));
  var vendorFootJs = gulp.src([
      paths.assets + 'js/dummy.js',
  ])
    .pipe(jshint())
    .pipe(concat('~vendorFoot.js'))
    .pipe(gulp.dest('/tmp'));
  var pubJsFoot = merge(vendorFootJs, srcFootJs)
    // .pipe(order(vendorFootJs))
    .pipe(concat('foot.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.pub + 'js/'));
  // run
  return merge(jsControllers, jsModels, srcHeadJs, vendorHeadJs, srcFootJs,
      vendorFootJs, pubJsHead, pubJsFoot);
});

/**
 * Task process-css
 * build and concat all sass, and css
 * @todo 	responsive includes per @media, and called via loader.scss
 */
gulp.task('process-css', function(){
  var faScssPath = paths.vendor + 'font-awesome/scss/font-awesome.scss',
    localScssPath = paths.assets + 'scss/*.scss',
    localCssPath = paths.assets + 'css/*.css',
    outputCssName = 'styles.css';
  var vendorSass =  gulp.src(faScssPath)
    .pipe(sass().on('error', sass.logError));
  var localSass = gulp.src([localScssPath]) //this is the one that contains the code we ant loaded LAST
    .pipe(sass().on('error', sass.logError));
  var localCss = gulp.src([localCssPath]);
  return merge(vendorSass, localCss, localSass) //this order was NOT working, so had to install gulp-order for this alone
    .pipe(order([
      paths.assets + faScssPath,
      paths.assets + localCssPath,
      paths.assets + localScssPath //this is the one that contains the code we ant loaded LAST
    ]))
    .pipe(concat(outputCssName))
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.pub + 'css'));
});

/**
 * Task process-fonts
 */
gulp.task('process-fonts', function(){
  var faVendorFonts = gulp.src(paths.vendor + 'font-awesome/fonts/*');
  var bsVendorFonts = gulp.src(paths.vendor + 'bootstrap/fonts/*');
  return merge(faVendorFonts,bsVendorFonts)
    .pipe(gulp.dest(paths.pub + 'fonts/'));
});

/**
 * Task lintcopy-jade
 */
gulp.task('lintcopy-jade', ['notifyReadyServe'], function() {
  return gulp.src(paths.jade + '**/*.jade')
    .pipe(jadelint())
    .pipe(gulp.dest(paths.pub + 'views/'));
});

/**
 * Task add-version-tag
 * Adds a version tag to the build dir, which is primarily currently used to keep
 * track to the fact that the files were actually recompiled or not, if your not
 * watching the* tag delete and recreate at the moment it does, then might
 * notice the time change.  If your still not watching when that happens, you
 * can open the file to see what exact time the file was created then look at
 * your system clock to compare, to verify that the files were indeed re-
 * compiled, if ever necessary.
 */
gulp.task('add-version-tag', function(cb){
  var dateIs = new Date(),
    dateStrIs = dateIs.toString(),
    responseTxt = 'Gulped! \n' + dateStrIs,
    nameStrIs = dateIs.getUTCMonth() + 1 + '_' + dateIs.getUTCDate() + '_' +
    dateIs.getUTCHours() + '_' + dateIs.getMinutes();
  file('v_' + nameStrIs, responseTxt) //make a new version tag, for the tag gun
      .pipe(gulp.dest(paths.pub)); //apply the sticker..
  return cb();
});

      /**
       * Task develop
       */
gulp.task('develop', ['lint-js', 'gls', 'watch'], function(){
  gutil.log('Running Develop task.  This is the final needed task.  Get to work!');
});

/**
 * Task lint-js
 */
gulp.task('lint-js', function(){
  return gulp.src([paths.src + '**.*.js', '*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Task gls
 */
gulp.task('gls', function(){
  setTimeout(function () {
    gutil.log('Gls Server Starting http://192.168.1.10:3000');
    gutil.log('Look for lint output, and correct errors accordingly, ready to ' +
    'begin development!');
    var server = gls.new('bin/www');
    server.start();
    //attempt to get an auto refresh after compile
    //server.notify().bind(server);
    gulp.watch(paths.pub + 'css/*.css', function(file){
      server.notify.apply(server, [file]);
    });
    gulp.watch(paths.pub + 'views/**/*.jade', function(file){
      server.notify.apply(server, [file]);
    });
    gulp.watch(paths.pub + '**/*.js', server.start.bind(server));
  }, 1000);
 });

 /**
  * Task watch
  * @info on file update, this watch runs the rewatch task for that file type
  */
gulp.task('watch', function(){
  setTimeout(function () {
    gulp.watch(paths.assets + 'js/', ['rewatch-js']);
    gulp.watch(paths.controllers + '*.js', ['rewatch-js']);
    gulp.watch(paths.models + '*.js', ['rewatch-js']);
    gulp.watch(paths.jade + '**/*.jade', ['rewatch-jade']);
    gulp.watch([paths.assets + 'scss', paths.assets + 'css/'], ['rewatch-css']);
  }, 1000);
});

/**
 * Tasks rewatch
 */
gulp.task('rewatch-js', ['lint-js', 'client-js'] );
gulp.task('rewatch-css', ['process-css'] );
gulp.task('rewatch-jade', ['lintcopy-jade'] );

      /**
       * Task compile-vendors
       */
gulp.task('compile-vendors', ['vendor-fontawesome', 'vendor-bootstrap',
 'vendor-jquery']);

/**
 * Task vendor-jquery
 * @info - module list https://github.com/jquery/jquery
 * @info - this one shows an example of incorporating a 3rd party builder to
 * create build the jquery with custom parameters first, then copy to vendor.
 * You can see here also how to recreate the path using file.
 * If your stack is in good order during development, when you make vendor
 * adjustments, just run the command in your console like this each time
 * 'gulp compile vendors && gulp build && gulp develop', , then refresh to test.
 * @note '-exports/global' module is needed for bs
 */
gulp.task('vendor-jquery', function(){
  //jquery-custom can do the building of the file first, we can copy after
  jQueryBuilder({
    release: 1,
    flags: ['-deprecated', '-event/alias', '-ajax/jsonp', '-ajax/script']
  }, function (err, str) {
    if (err) return console.error(err);
    file('jquery.js', str, { src: true })
      .pipe(rename({
        dirname:  'jquery',
        basename: 'jquery-custom',
        extname:  '.js'
      }))
      .pipe(gulp.dest(paths.vendor)); //want to be named jquery.js by default, messing with that will get wierd results without resetting the path or dirname robably
  })
});

/**
 * Task vendor-fontawesome
 * demonstrates how to check if file exists, before copying vendor files directly
 * from node_modules.  This is a one time deal.  It can be re-ran when either
 * new vendors are added here, or when you need a new copy of your vendors
 * loaded for whatever reason.
 */
gulp.task('vendor-fontawesome', function(){
  var faVarFileName = '_variables.scss',
  // faScssFiles = paths.vendor + 'font-awesome/scss/*.scss',
    faVarFile = paths.vendor + 'font-awesome/scss/' + faVarFileName;
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
    .pipe(gulp.dest(paths.vendor + 'font-awesome/'));
});

/**
 * Task vendor-bootstrap
 * THis vendor copy takes things to the next level.  Since there is multiple file
 * types being worked with here, there is an entry for each type, and each has
 * its own separate copy execution, one of which does some further processing
 * before outputting, then finally using merge to execute all at once, by
 * convenience.
 */
gulp.task('vendor-bootstrap', function(){
  var bootstrapJs = gulp.src([
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap-sprockets.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'
    ])
    .pipe(concat('bootstrap.custom.js'))
    .pipe(gulp.dest(paths.vendor + 'bootstrap'));
  var bootstrapCss = gulp.src([
    './node_modules/bootstrap-sass/assets/stylesheets/_bootstrap-sprockets.scss',
    './node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss'
    ])
    .pipe(gulp.dest(paths.vendor + 'bootstrap/scss/'));
  var vendorCopyBsFonts = gulp.src('./node_modules/bootstrap-sass/assets/fonts/bootstrap/glyph*.*')
    .pipe(gulp.dest(paths.vendor + 'bootstrap/fonts/'));
  // var bootstrapImages = gulp.src(['./node_modules/bootstrap-sass/assets/images'])
    // .pipe(gulp.dest(paths.vendor + 'bootstrap/images/'));
  return merge(bootstrapJs, bootstrapCss, vendorCopyBsFonts);
});


      /**
       * Support Tasks
       */

/**
* Task clean
* used in develop and watch
*/
gulp.task('clean', function(cb){
  del(paths.del); //all app output is built here, so clean-slate it..
  setTimeout(function () {
    //
    file('dummy.js', 'var = dummy = {a:3};', { src: true })
        .pipe(gulp.dest(paths.vendor))
        cb();
      //return cb();
  }, 5000);
});

/**
 * Task css
 * @info used in watch
 */
gulp.task('css',  function(){
  return gulp.src(paths.assets + 'css/')
    .pipe(concat('styles.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.pub + 'css/'));
});

/**
 * Task jadecompile
 * @todo
 */
gulp.task('jadecompile', function() {
  return gulp.src(paths.jade + '**/*.jade')
    .pipe(jadelint())
    .pipe(jade({
      client: true
    }))
    .pipe(rename(function(path){
      path.extname = ".jade";
    }))
    .pipe(gulp.dest(paths.pub + 'views/'));
    //.pipe( livereload( server ));
});
