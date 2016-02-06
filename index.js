require('babel-register');

module.exports = {
  Resource: require('./src/resource/resource').default,
  Http: require('./src/http/http').default,
  Request: require('./src/http/request').default,
  Response: require('./src/http/response').default
};
