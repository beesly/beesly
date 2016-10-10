import Response from '../../src/http/response';

describe('Response', () => {
  describe('get json', () => {
    it('should transform the body of the response to json', () => {
      let response = new Response(200, '{"foo": "bar"}');
      expect(response.json).toEqual({"foo": "bar"});
    });
  });

  describe('get text', () => {
    it('should return the unaltered response body', () => {
      let response = new Response(200, '{"foo": "bar"}');
      expect(response.text).toEqual('{"foo": "bar"}');
    });
  });

  describe('get statusCode', () => {
    it('should return the http status code of the response', () => {
      let response = new Response(200, '{"foo": "bar"}');
      expect(response.statusCode).toEqual(200);
    });
  });
  
  describe('get contentType', () => {
    it('should return the content type, case insensitively', () => {
      let response = new Response(200, '', {"Content-Type": 'foo'});
      expect(response.contentType).toEqual('foo');

      response = new Response(200, '', {"Content-type": 'bar'});
      expect(response.contentType).toEqual('bar');

      response = new Response(200, '', {"content-Type": 'bazz'});
      expect(response.contentType).toEqual('bazz');
    });
  })

});
