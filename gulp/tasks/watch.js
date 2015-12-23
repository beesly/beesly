const gulp = require('gulp')
  config = require('../config');

gulp.task('watch', ['build', 'lint'], () => {
  return gulp.watch(config.watch.paths, ['lint', 'build']);
});
