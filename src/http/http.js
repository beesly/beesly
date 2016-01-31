import Response from './response';

function stringify(data, headers) {
  if (typeof data === 'string' || !data) {
    return data;
  }

  if ('Content-type' in headers && /json/.test(headers['Content-type'])) {
    return JSON.stringify(data);
  }

  let str = '';
  for (const key of Object.keys(data)) {
    str += `${key}=${encodeURIComponent(data[key])}&`;
  }

  return str.slice(0, -1);
}

function buildXhr(request) {
  const xhr = new XMLHttpRequest();

  if ('withCredentials' in xhr) {
    xhr.open(request.method, request.url, true);
  } else {
    throw new Error('CORS is not supported on this platform');
  }

  for (const key of Object.keys(request.headers)) {
    xhr.setRequestHeader(key, request.headers[key]);
  }

  return xhr;
}

function parseHeaders(headerString) {
  const headers = {};

  if (!headerString) {
    return headers;
  }

  const headerRows = headerString.trim().split('\r\n');
  headerRows.forEach((header) => {
    const values = header.split(':', 2);
    headers[values[0].trim()] = values[1].trim();
  });

  return headers;
}

class Http {
  static addIntercept(cb) {
    this.interceptors.push(cb);
  }

  static interceptRequest(request) {
    Http.interceptors.forEach(interceptor => interceptor.call(null, request));

    return request;
  }

  static clearInterceptors() {
    this.interceptors = [];
  }

  send(request) {
    Http.interceptRequest(request);

    const xhr = buildXhr(request);

    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        const response = new Response(
          xhr.status,
          xhr.responseText,
          parseHeaders(xhr.getAllResponseHeaders())
        );

        if (xhr.status >= 200 && xhr.status < 400) {
          resolve(response);
        } else {
          reject(response);
        }
      };

      xhr.onerror = () => reject(Error('Request failed'));
      xhr.send(stringify(request.content, request.headers));
    });
  }
}

Http.interceptors = [];

export default Http;
