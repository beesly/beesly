import Http from '../../src/http/http';
import Request from '../../src/http/request';
import Response from '../../src/http/response';

describe('Http', () => {

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
      let xhr = {send: () => {}, open: () => {}};
      spyOn(window, 'XMLHttpRequest').andReturn(xhr);

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
      let xhr = {send: () => {}, open: () => {}, withCredentials: true};
      spyOn(window, 'XMLHttpRequest').andReturn(xhr);
      spyOn(xhr, 'open');
      spyOn(xhr, 'send');

      let http = new Http();
      http.send('foo', new Request('/foo', ''));

      expect(xhr.open).toHaveBeenCalledWith('foo', '/foo', true);
      expect(xhr.send).toHaveBeenCalledWith('');
    });

    pit('should return a Promise that resolves to a Response', () => {
      let xhr = {send: () => {}, open: () => {}, withCredentials: true};
      spyOn(window, 'XMLHttpRequest').andReturn(xhr);
      spyOn(xhr, 'open');
      spyOn(xhr, 'send');

      let http = new Http();
      let promise = http.send('foo', new Request('/foo', '')).then((response) => {
        expect(response).toEqual(jasmine.any(Response));
      });

      expect(promise).toEqual(jasmine.any(Promise));

      xhr.status = 200;
      xhr.onload();

      return promise;
    });

    pit('should properly hydrate a response', () => {
      let xhr = {send: () => {}, open: () => {}, withCredentials: true};
      spyOn(window, 'XMLHttpRequest').andReturn(xhr);
      spyOn(xhr, 'open');
      spyOn(xhr, 'send');

      let http = new Http();
      let promise = http.send('foo', new Request('/foo', '')).then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual('foobarrr');
      });

      xhr.status = 200;
      xhr.responseText = 'foobarrr';
      xhr.onload();

      return promise;
    });

    pit('should reject the promise on a bad status code', () => {
      let xhr = {send: () => {}, open: () => {}, withCredentials: true};
      spyOn(window, 'XMLHttpRequest').andReturn(xhr);
      spyOn(xhr, 'open');
      spyOn(xhr, 'send');

      let http = new Http();
      let promise = http.send('foo', new Request('/foo', '')).then(() => {}, (error) => {
        expect(error.message).toEqual('Received error response with code 500');
      });

      xhr.status = 500;
      xhr.onload();

      return promise;
    });

    pit('should reject the promise on error', () => {
      let xhr = {send: () => {}, open: () => {}, withCredentials: true};
      spyOn(window, 'XMLHttpRequest').andReturn(xhr);
      spyOn(xhr, 'open');
      spyOn(xhr, 'send');

      let http = new Http();
      let promise = http.send('foo', new Request('/foo', '')).then(() => {}, (error) => {
        expect(error.message).toEqual('Request failed');
      });

      xhr.onerror();

      return promise;
    });

    it('should properly format the JSON data', () => {
      let xhr = {send: () => {}, open: () => {}, withCredentials: true, setRequestHeader: () => {}};
      spyOn(window, 'XMLHttpRequest').andReturn(xhr);
      spyOn(xhr, 'open');
      spyOn(xhr, 'send');

      let http = new Http(),
        request = new Request('/foo', {"foo": "bar"}, {'Content-type': 'application/json'});

      http.get(request);

      expect(xhr.send).toHaveBeenCalledWith('{"foo":"bar"}');
    });
  });

  describe('get()', () => {
    it('should make an HTTP GET request', () => {
      let xhr = {send: () => {}, open: () => {}, withCredentials: true};
      spyOn(window, 'XMLHttpRequest').andReturn(xhr);
      spyOn(xhr, 'open');
      spyOn(xhr, 'send');

      let http = new Http();
      http.get(new Request('/foo', ''));

      expect(xhr.open).toHaveBeenCalledWith('GET', '/foo', true);
    });
  });

  describe('get()', () => {
    it('should make an HTTP GET request', () => {
      let xhr = {send: () => {}, open: () => {}, withCredentials: true};
      spyOn(window, 'XMLHttpRequest').andReturn(xhr);
      spyOn(xhr, 'open');
      spyOn(xhr, 'send');

      let http = new Http();
      http.post(new Request('/foo', ''));

      expect(xhr.open).toHaveBeenCalledWith('POST', '/foo', true);
    });
  });

  describe('put()', () => {
    it('should make an HTTP GET request', () => {
      let xhr = {send: () => {}, open: () => {}, withCredentials: true};
      spyOn(window, 'XMLHttpRequest').andReturn(xhr);
      spyOn(xhr, 'open');
      spyOn(xhr, 'send');

      let http = new Http();
      http.put(new Request('/foo', ''));

      expect(xhr.open).toHaveBeenCalledWith('PUT', '/foo', true);
    });
  });

  describe('patch()', () => {
    it('should make an HTTP GET request', () => {
      let xhr = {send: () => {}, open: () => {}, withCredentials: true};
      spyOn(window, 'XMLHttpRequest').andReturn(xhr);
      spyOn(xhr, 'open');
      spyOn(xhr, 'send');

      let http = new Http();
      http.patch(new Request('/foo', ''));

      expect(xhr.open).toHaveBeenCalledWith('PATCH', '/foo', true);
    });
  });

  describe('delete()', () => {
    it('should make an HTTP DELETE request', () => {
      let xhr = {send: () => {}, open: () => {}, withCredentials: true};
      spyOn(window, 'XMLHttpRequest').andReturn(xhr);
      spyOn(xhr, 'open');
      spyOn(xhr, 'send');

      let http = new Http();
      http.delete(new Request('/foo', ''));

      expect(xhr.open).toHaveBeenCalledWith('DELETE', '/foo', true);
    });
  });

});
