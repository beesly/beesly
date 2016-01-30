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
      spyOn(window, 'XMLHttpRequest').andReturn(this.xhr);

      let exception = null;

      try {
        let http = new Http();
        http.send('foo', new Request('/foo', ''));
      } catch (e) {
        exception = e;
      }

      expect(exception.message).toBe('CORS is not supported on this platform');
    });

    it('should make the correct HTTP request', () => {
      this.xhr.withCredentials = true;
      spyOn(window, 'XMLHttpRequest').andReturn(this.xhr);
      spyOn(this.xhr, 'open');
      spyOn(this.xhr, 'send');

      let http = new Http();
      http.send('foo', new Request('/foo', ''));

      expect(this.xhr.open).toHaveBeenCalledWith('foo', '/foo', true);
      expect(this.xhr.send).toHaveBeenCalledWith('');
    });

    pit('should return a Promise that resolves to a Response', () => {
      this.xhr.withCredentials = true;
      spyOn(window, 'XMLHttpRequest').andReturn(this.xhr);
      spyOn(this.xhr, 'open');
      spyOn(this.xhr, 'send');

      let http = new Http();
      let promise = http.send('foo', new Request('/foo', '')).then((response) => {
        expect(response).toEqual(jasmine.any(Response));
      });

      expect(promise).toEqual(jasmine.any(Promise));

      this.xhr.status = 200;
      this.xhr.onload();

      return promise;
    });

    pit('should properly hydrate a response', () => {
      this.xhr.withCredentials = true;
      spyOn(window, 'XMLHttpRequest').andReturn(this.xhr);
      spyOn(this.xhr, 'open');
      spyOn(this.xhr, 'send');

      let http = new Http();
      let promise = http.send('foo', new Request('/foo', '')).then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual('foobarrr');
      });

      this.xhr.status = 200;
      this.xhr.responseText = 'foobarrr';
      this.xhr.onload();

      return promise;
    });

    pit('should reject the promise on a bad status code', () => {
      this.xhr.withCredentials = true;
      spyOn(window, 'XMLHttpRequest').andReturn(this.xhr);
      spyOn(this.xhr, 'open');
      spyOn(this.xhr, 'send');

      let http = new Http();
      let promise = http.send('foo', new Request('/foo', '')).then(() => {}, (error) => {
        expect(error).toEqual(jasmine.any(Response));
        expect(error.statusCode).toEqual(500);
      });

      this.xhr.status = 500;
      this.xhr.onload();

      return promise;
    });

    pit('should reject the promise on error', () => {
      this.xhr.withCredentials = true;
      spyOn(window, 'XMLHttpRequest').andReturn(this.xhr);
      spyOn(this.xhr, 'open');
      spyOn(this.xhr, 'send');

      let http = new Http();
      let promise = http.send('foo', new Request('/foo', '')).then(() => {}, (error) => {
        expect(error.message).toEqual('Request failed');
      });

      this.xhr.onerror();

      return promise;
    });

    it('should properly format the JSON data', () => {
      this.xhr.withCredentials = true;
      spyOn(window, 'XMLHttpRequest').andReturn(this.xhr);
      spyOn(this.xhr, 'open');
      spyOn(this.xhr, 'send');

      let http = new Http(),
        request = new Request('/foo', {"foo": "bar"}, {'Content-type': 'application/json'});

      http.get(request);

      expect(this.xhr.send).toHaveBeenCalledWith('{"foo":"bar"}');
    });
  });

  describe('get()', () => {
    it('should make an HTTP GET request', () => {
      this.xhr.withCredentials = true;
      spyOn(window, 'XMLHttpRequest').andReturn(this.xhr);
      spyOn(this.xhr, 'open');
      spyOn(this.xhr, 'send');

      let http = new Http();
      http.get(new Request('/foo', ''));

      expect(this.xhr.open).toHaveBeenCalledWith('GET', '/foo', true);
    });
  });

  describe('get()', () => {
    it('should make an HTTP GET request', () => {
      this.xhr.withCredentials = true;
      spyOn(window, 'XMLHttpRequest').andReturn(this.xhr);
      spyOn(this.xhr, 'open');
      spyOn(this.xhr, 'send');

      let http = new Http();
      http.post(new Request('/foo', ''));

      expect(this.xhr.open).toHaveBeenCalledWith('POST', '/foo', true);
    });
  });

  describe('put()', () => {
    it('should make an HTTP GET request', () => {
      this.xhr.withCredentials = true;
      spyOn(window, 'XMLHttpRequest').andReturn(this.xhr);
      spyOn(this.xhr, 'open');
      spyOn(this.xhr, 'send');

      let http = new Http();
      http.put(new Request('/foo', ''));

      expect(this.xhr.open).toHaveBeenCalledWith('PUT', '/foo', true);
    });
  });

  describe('patch()', () => {
    it('should make an HTTP GET request', () => {
      this.xhr.withCredentials = true;
      spyOn(window, 'XMLHttpRequest').andReturn(this.xhr);
      spyOn(this.xhr, 'open');
      spyOn(this.xhr, 'send');

      let http = new Http();
      http.patch(new Request('/foo', ''));

      expect(this.xhr.open).toHaveBeenCalledWith('PATCH', '/foo', true);
    });
  });

  describe('delete()', () => {
    it('should make an HTTP DELETE request', () => {
      this.xhr.withCredentials = true;
      spyOn(window, 'XMLHttpRequest').andReturn(this.xhr);
      spyOn(this.xhr, 'open');
      spyOn(this.xhr, 'send');

      let http = new Http();
      http.delete(new Request('/foo', ''));

      expect(this.xhr.open).toHaveBeenCalledWith('DELETE', '/foo', true);
    });
  });

});
