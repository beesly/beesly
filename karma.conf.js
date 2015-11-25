module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'jasmine'],
    files: ['src/**/*.js'],
    autoWatch: true,
    browsers: ['PhantomJS'],
    preprocessors: {
      'src/**/*.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: [['babelify', {presets: 'es2015'}]]
    }
  });
};
