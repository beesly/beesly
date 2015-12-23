const gulp = require('gulp'),
  eslint = require('gulp-eslint');

gulp.task('lint', () => {
  return gulp.src(['src/*.jsx', 'src/**/*.jsx'])
    .pipe(eslint())
    .pipe(eslint.format())
    // .pipe(eslint.failAfterError());
});
