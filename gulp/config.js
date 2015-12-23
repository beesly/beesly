const concat = require('gulp-concat');

const src = 'src',
  dist = 'dist';

module.exports = {
  dist: dist,
  src: src,

  watch: {
    paths: ['js'].reduce((paths, ext) => {
      return paths.concat([
        src + '/**/*.' + ext,
        src + '/*.' + ext
      ]);
    }, [])
  },
};
