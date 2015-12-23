const config = require('../config'),
  del = require('del'),
  gulp = require('gulp');

gulp.task('clean', (cb) => {
  return del([config.dist], cb);
});
