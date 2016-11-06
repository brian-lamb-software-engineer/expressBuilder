/**
 * Task add version tag
 * adds a version tag, in the form of a file, on each build
 * you can reference this file by looking in the www dir.
 */
 var gulp =  require('gulp'),
  merge =         require('merge-stream'),
  file = require('gulp-file'),
  config = require('../../../../../config.json');

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
      .pipe(gulp.dest(config.paths.pub)); //apply the sticker..
  return cb();
});
