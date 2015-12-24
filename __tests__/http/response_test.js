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

});
