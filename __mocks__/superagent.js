var superagentMock = jest.genMockFromModule('superagent');

var response = '';

function __setResponse(expectedResponse) {
  response = expectedResponse;
}

function get(url) {
  return {
    end: function (cb) {
      cb(null, response);
    }
  };
};

superagentMock.__setResponse = __setResponse;
superagentMock.get.mockImplementation(get);

module.exports = superagentMock;
