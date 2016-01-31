import Request from '../../src/http/request';

describe('Request', function requestTest() {
  beforeEach(() => {
    this.request = new Request(
      'get',
      '/foo',
      '{"boo": "bar"}',
      {"Content-Type": "application/json"}
    );
  });

  describe('hasHeader()', () => {
    it('should return true if the Request has the header', () => {
      expect(this.request.hasHeader('Content-Type')).toBe(true);
    });

    it('should return false if the Request does not have the header', () => {
      expect(this.request.hasHeader('Authorization')).toBe(false);
    });
  });

  describe('setHeader()', () => {
    it('should add the header', () => {
      this.request.setHeader('Authorization', 'Token');
      expect(this.request.headers['Authorization']).toBe('Token');
    });

    it('should replace an existing header', () => {
      this.request.setHeader('Content-Type', 'application/xml');
      expect(this.request.headers['Content-Type']).toBe('application/xml');
    });
  });

  describe('getHeader()', () => {
    it('should return the header if it exists', () => {
      expect(this.request.getHeader('Content-Type')).toBe('application/json');
    });

    it('should return undefined if no header is set', () => {
      expect(this.request.getHeader('Authorization')).toBeUndefined();
    });
  });

});
