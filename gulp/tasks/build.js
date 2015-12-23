const babelify = require('babelify'),
  browserify = require('browserify'),
  buffer = require('vinyl-buffer'),
  config = require('../config'),
  gulp = require('gulp'),
  rename = require('gulp-rename'),
  source = require('vinyl-source-stream');

gulp.task('build', ['clean'], () => {
  var options = {
    entries: config.src + '/../index.js'
  };

  return browserify(options)
    .transform(babelify)
    .bundle()
    .pipe(source(config.src + '/../index.js'))
    .pipe(buffer())
    .pipe(rename((path) => {
      path.dirname = ''; //strip the src path
      path.basename = 'beesly';
    }))
    .pipe(gulp.dest(config.dist));
});
