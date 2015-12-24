import Response from './response';

function stringify(data, headers) {
  if (typeof data === 'string' || !data) {
    return data;
  }

  if ('Content-type' in headers && /json/.test(headers['Content-type'])) {
    return JSON.stringify(data);
  }

  let str = '';
  for (let key of Object.keys(data)) {
    str += `${key}=${encodeURIComponent(data[key])}&`
  }

  return str.slice(0, -1);
}

function buildXhr(method, request) {
  let xhr = new XMLHttpRequest();

  if ('withCredentials' in xhr) {
    xhr.open(method, request.url, true);
  } else {
    throw new Error('CORS is not supported on this platform');
  }

  for (let key of Object.keys(request.headers)) {
    xhr.setRequestHeader(key, request.headers[key]);
  }

  return xhr;
}

class Http {
  static addIntercept(cb) {
    this.interceptors.push(cb);
  }

  static interceptRequest(request) {
    Http.interceptors.forEach(function (interceptor) {
      interceptor.call(null, request);
    });

    return request;
  }

  static clearInterceptors() {
    this.interceptors = [];
  }

  get(request) {
    Http.interceptRequest(request);

    let xhr = buildXhr('GET', request);

    return new Promise((resolve, reject) => {
       xhr.onload = () => {
         let response = xhr.responseText;

         if (xhr.status >= 200 && xhr.status < 400) {
           resolve(new Response(xhr.status, response));
           return;
         }
         reject(Error(`Received error response with code ${xhr.status}`), response);
       };

       xhr.onerror = () => reject(Error('Request failed'));
       xhr.send(stringify(request.data, request.headers));
     });
  }
}

Http.interceptors = [];

export default Http;
