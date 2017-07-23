/**
 * Task vendor item
 * output user message
 */
var gulp =          require('gulp');
var jQueryBuilder = require('jquery-custom');

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
        .pipe(gulp.dest(gulp.config.paths.vendor)); //want to be named jquery.js by default, messing with that will get wierd results without resetting the path or dirname robably
    })
  });
