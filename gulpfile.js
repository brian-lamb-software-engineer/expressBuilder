/*****************
 * expressBuilder *
 ******************
/**
 * GULP
 * What do we want gulp to do today folks?
 * Gulp modules are located in ./src/assets/js
 *
 * Parent Task list (Main usage commands, and their descriptions)
 * --------------------------------------------------------------
 * $ gulp compile-vendors
 *                  Rebuilds vendors, by copying selected node_modules vendor
 *                  sources to the vendor directory.  Needed only after
 *                  adjustment of vendor/sources.  Note, nodemon combined with
 *                  livereload, also does this automatically during the "watch".
 *
 * $ gulp build
 *                  Lints the server, builds all src files that are specified in
 *                  the build tasks into pub dir by first deleting selected
 *                  files in build dir(most if not all, see note below), then
 *                  uses various methods such as copying in any specified
 *                  vendors from ./vendor, lints and uglifies all JS files,
 *                  processes any sass/less, processes specified images, copies
 *                  in specified fonts, minifies all css, compiles templates,
 *                  to build dir, leaving the build dir freshed and ready to be
 *                  served.  It also writes out a new version tag file to the
 *                  build dir.
 *
 *                  -Note, get used to the delete portion, what you want is all
 *                  deleted, since no files should EVER be stored in, or edited
 *                  out of, the build dir.
 *
 *                  -Note the build dir is referred to the pub dir, and is
 *                  currently the ./www dir on this application by default,
 *                  and can be renamed to whatever you want. (see config.json)
 *
 *                  -Note, the build dir is the entire web app intended to be
 *                  deployed.  Its up to you to decide how you serve it on your
 *                  production server.  As an option, you can deploy the entire
 *                  package and use Forever or PM2, and add to cron @reboot to
 *                  run the node server on your production host.
 *
 * $ gulp develop
 *                  Runs tests first, then lints all JS once again, including
 *                  gulp files and server, loads livereload daemon, starts
 *                  nodemon which runs your node back-end JS server, then starts
 *                  a file watch on those files to trigger reloads for any file
 *                  changes on either the src files, or the server itself.
 *
 *                  When watch detects, it will refresh the build, when
 *                  livereload detects the changes in the build, the task was
 *                  set up so that you will not need the live reload plugin for
 *                  this setup, therefore this will work cross-browser on
 *                  multiple browsers at the same time, all opened to various
 *                  responsive sizes.  This delivers an ultimate RWD experience.
 *                  It sends a refresh to the head in any and all open browsers.
 *
 *                  When nodemon detects a change in the server file,
 *                  it will refresh the node server so that you wont have to
 *                  restart gulp again(under some circumstances, you may then
 *                  need to refresh your browser for server file updates).
 *
 * $ gulp all (default task)
 *                  Runs compile-vendor, then build, then develop
 *
 * $ gulp
 *                  Run gulp to begin your day.  Edit your files, save and see
 *                  instant head refreshes.  As long as you dont save
 *                  any files with syntax errors, nodemon or livereload wont
 *                  crash.  Otherwise, you can just rerun $ gulp, after glancing
 *                  at its error output. Rinse and repeat...
 *
 * Alt commands:
 * $ gulp gls
 *                  directly starts live reload server, and watch, no tests, no
 *                  linting.
 *
 * $ npm start
 *                  -Starts the server with current version of build without
 *                  runningi any gulp tasks, therefore bypasses building, the
 *                  livereload server, and watch altogether, then starts a
 *                  normal node http server. (Can run this anytime after build
 *                  complete, but it unecessary)
 *
 * This setup is not constrained to using JADE as a template engine, or SASS as
 * the main CSS pre processor, nor is it consrained to using jquery and bootstrap
 * or font-awesome, or MongoDB.  You can remove these modules and replace them
 * with your favorite, then update the pertineny app files and tasks.
 *
 * Modernizr, React and maybe underscore will soon be added, but you
 * can choose and JS framework you want thats available on NPM.  The current
 * usage of Mongoose ODM will be kept.
 *
 * A fresh breath of air!
 */

// DEBUG FUNCTION, UNCOMMENT WHEN YOU SEE ENOENT or other errors, to find the
// backtrace(normally at the top of the output is the valuable portion).
//
 // (function() {
 //     var childProcess = require("child_process");
 //     var oldSpawn = childProcess.spawn;
 //     function mySpawn() {
 //         console.log('spawn called');
 //         console.log(arguments);
 //         var result = oldSpawn.apply(this, arguments);
 //         return result;
 //     }
 //     childProcess.spawn = mySpawn;
 // })();

 var gulp = require('gulp');
 gulp.appport = '3003'; // @todo get dynamic
 gulp.pathconfig = require('./config.json');

 const gulpRequireTasks = require('gulp-require-tasks');
 gulpRequireTasks({
   path: process.cwd() + '/src/assets/js/gulp'
 });

 /**
  * Task default
  */
 gulp.task('default', ['all']);
