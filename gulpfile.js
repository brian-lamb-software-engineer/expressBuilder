//what do we want gulp to do

//include gulp, and plugins

// var paths.scripts = ['./www/js/**/*.coffee', '!client/external/**/*.coffee'],
var gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  tinylr = require('tiny-lr'),
  express = require('express'),
  server = tinylr(),
  minifyCss = require('gulp-minify-css'),
  del = require('del'),
  file = require('gulp-file'),
  livereload = require('gulp-livereload'), //https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
  paths = {
    appjs: './src/*.js',
    models: './src/**/model/*.js',
    routes: './src/**/routes/*.js',
    images: './src/images/**/*',
    scss: './src/**/public/css/*.scss',
    css: './src/**/public/css/*.css',
    build: './www',
    scripts: './www/js/'
  };

//define tasks
gulp.task('clean', function(){
  gutil.log('Cleaning!');
  dateIs = new Date(),
  dateStrIs = dateIs.toString(),
  nameStrIs = dateIs.getUTCMonth() + 1 + '_' + dateIs.getUTCDate() + '_' + dateIs.getUTCHours() + '_' + dateIs.getMinutes();
  return del([paths.build]) //all app output is built here, so clean-slate it..
})

gulp.task('tagIt', ['clean'], function(){
  gutil.log('Tagging it!');
  return file('v_' + nameStrIs, 'Gulped! \n' + dateStrIs) //make a new version tag, for the tag gun
      .pipe(gulp.dest(paths.build)); //apply the sticker..
})

gulp.task('sass', ['clean'], function(){
  gutil.log('Compiling SASS!');
  return gulp.src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.build))
    .pipe( livereload( server ));
});

gulp.task('css', ['clean'], function(){
  gutil.log('Compiling CSS!');
  return gulp.src(paths.css)
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.build))
    .pipe( livereload( server ));
});

gulp.task('app', ['clean'],  function(){
  gutil.log('Compiling app.js!');
  return gulp.src(paths.appjs)
    .pipe(uglify())
    .pipe(gulp.dest(paths.build));
});

gulp.task('routes', ['clean'], function(){
  gutil.log('Compiling routes!');
  return gulp.src(paths.routes)
    .pipe(rename({dirname: '', prefix: 'route_'}))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts));
});

gulp.task('model', ['clean'], function(){
  gutil.log('Compiling models!');
  return gulp.src(paths.models)
    .pipe(rename({dirname: '', prefix: 'model_'}))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts));
});

gulp.task('watch', function(){
  gulp.watch(paths.appjs, ['app']);
  gulp.watch(paths.routes, ['routes']);
  gulp.watch(paths.models, ['models']);
  gulp.watch(paths.scss, ['sass']);
  gulp.watch(paths.css, ['css']);
})

//default task
gulp.task('default', ['watch', 'app', 'routes', 'model', 'sass']);

/**
 * MISC CODE
 */

// //live reload
// gulp.task('server', function () {
//
//     // Start the server at the beginning of the task
//     expressserver.run(['app.js']);
//
//     // Restart the server when file changes
//     gulp.watch(['www/**/*.html'], expressserver.notify);
//     gulp.watch(['src/**/public/css/*.scss'], ['styles:scss']);
//     //gulp.watch(['{.tmp,app}/styles/**/*.css'], ['styles:css', expressserver.notify]);
//     //Event object won't pass down to gulp.watch's callback if there's more than one of them.
//     //So the correct way to use expressserver.notify is as following:
//     gulp.watch(['{.tmp,app}/styles/**/*.css'], function(event){
//         gulp.run('styles:css');
//         expressserver.notify(event);
//         //pipe support is added for expressserver.notify since v0.1.5,
//         //see https://github.com/gimm/gulp-express#servernotifyevent
//     });
//
//     gulp.watch(['src/**/public/js/*.js'], ['jshint']);
//     gulp.watch(['src/**/public/images/**/*'], expressserver.notify);
//     gulp.watch(['app.js', './js/route_*.js'], [expressserver.run]);
// });

// gulp.task('scripts', function(){
//   return gulp.src('src/*.js')
//     .pipe(foreach(function(stream, file){
//       var contents = JSON.parse(file.contents.toString('utf8'));
//       //var strippedContents = strip(contents);
//
//       return gulp.src(contents.f  iles)
//       .pipe(concat(path.basename(file.path)));
//     }))
//     .pipe(gulp.dest('www/js'));
// });
