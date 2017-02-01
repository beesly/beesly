import Http from '../../src/http/http';
import Request from '../../src/http/request';
import Response from '../../src/http/response';

describe('Http', function() {

  beforeEach(() => {
    this.xhr = {
      setRequestHeader: () => {},
      send: () => {},
      open: () => {},
      getAllResponseHeaders: () => ''
    };
  })

  describe('interceptors', () => {
    it('should have an empty collection by default', () => {
      expect(Http.interceptors.length).toBe(0);
    });

    it('should properly add interceptors', () => {
      let callback = () => {};
      Http.addIntercept(callback);

      expect(Http.interceptors.length).toBe(1);
      expect(Http.interceptors[0]).toBe(callback);
    });

    it('should clear the interceptors', () => {
      expect(Http.interceptors.length).toBe(1);
      Http.clearInterceptors();

      expect(Http.interceptors.length).toBe(0);
    });

    it('should pass the request to each interceptor in the collection', function () {
      let callback1 = (request) => {request[1] = 1},
        callback2 = (request) => {request[2] = 2};
      Http.addIntercept(callback1);
      Http.addIntercept(callback2);

      let request = {};
      Http.interceptRequest(request);

      expect(request[1]).toBe(1);
      expect(request[2]).toBe(2);
    });
  });

  describe('send()', () => {
    it('should throw an Error if CORS is not supported', () => {
      spyOn(window, 'XMLHttpRequest').and.returnValue(this.xhr);

      let exception = null;

      try {
        let http = new Http();
        http.send(new Request('get', '/foo', ''));
      } catch (e) {
        exception = e;
      }

      expect(exception.message).toBe('CORS is not supported on this platform');
    });

    it('should make the correct HTTP request', () => {
      this.xhr.withCredentials = true;
      spyOn(window, 'XMLHttpRequest').and.returnValue(this.xhr);
      spyOn(this.xhr, 'open');
      spyOn(this.xhr, 'send');

      let http = new Http();
      http.send(new Request('get', '/foo', ''));

      expect(this.xhr.open).toHaveBeenCalledWith('GET', '/foo', true);
      expect(this.xhr.send).toHaveBeenCalledWith('');
    });

    it('should return a Promise that resolves to a Response', () => {
      this.xhr.withCredentials = true;
      spyOn(window, 'XMLHttpRequest').and.returnValue(this.xhr);
      spyOn(this.xhr, 'open');
      spyOn(this.xhr, 'send');

      let http = new Http();
      let promise = http.send(new Request('get', '/foo', '')).then((response) => {
        expect(response).toEqual(jasmine.any(Response));
      });

      expect(promise).toEqual(jasmine.any(Promise));

      this.xhr.status = 200;
      this.xhr.onload();

      return promise;
    });

    it('should properly hydrate a response', () => {
      this.xhr.withCredentials = true;
      spyOn(window, 'XMLHttpRequest').and.returnValue(this.xhr);
      spyOn(this.xhr, 'open');
      spyOn(this.xhr, 'send');

      let http = new Http();
      let promise = http.send(new Request('get', '/foo', '')).then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual('foobarrr');
      });

      this.xhr.status = 200;
      this.xhr.responseText = 'foobarrr';
      this.xhr.onload();

      return promise;
    });

    it('should reject the promise on a bad status code', () => {
      this.xhr.withCredentials = true;
      spyOn(window, 'XMLHttpRequest').and.returnValue(this.xhr);
      spyOn(this.xhr, 'open');
      spyOn(this.xhr, 'send');

      let http = new Http();
      let promise = http.send(new Request('get', '/foo', '')).then(() => {}, (error) => {
        expect(error).toEqual(jasmine.any(Response));
        expect(error.statusCode).toEqual(500);
      });

      this.xhr.status = 500;
      this.xhr.onload();

      return promise;
    });

    it('should reject the promise on error', () => {
      this.xhr.withCredentials = true;
      spyOn(window, 'XMLHttpRequest').and.returnValue(this.xhr);
      spyOn(this.xhr, 'open');
      spyOn(this.xhr, 'send');

      let http = new Http();
      let promise = http.send(new Request('get', '/foo', '')).then(() => {}, (error) => {
        expect(error.message).toEqual('Request failed');
      });

      this.xhr.onerror();

      return promise;
    });

    it('should properly format the JSON data', () => {
      this.xhr.withCredentials = true;
      spyOn(window, 'XMLHttpRequest').and.returnValue(this.xhr);
      spyOn(this.xhr, 'open');
      spyOn(this.xhr, 'send');

      let http = new Http(),
        request = new Request('get', '/foo', {"foo": "bar"}, {'Content-type': 'application/json'});

      http.send(request);

      expect(this.xhr.send).toHaveBeenCalledWith('{"foo":"bar"}');
    });
  });

});
