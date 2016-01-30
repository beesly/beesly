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

function buildXhr(method, request) {
  const xhr = new XMLHttpRequest();

  if ('withCredentials' in xhr) {
    xhr.open(method, request.url, true);
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

  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.patch = this.patch.bind(this);
    this.put = this.put.bind(this);
    this.delete = this.delete.bind(this);
  }

  send(method, request) {
    Http.interceptRequest(request);

    const xhr = buildXhr(method, request);

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
      xhr.send(stringify(request.data, request.headers));
    });
  }

  get(request) {
    return this.send('GET', request);
  }

  post(request) {
    return this.send('POST', request);
  }

  patch(request) {
    return this.send('PATCH', request);
  }

  put(request) {
    return this.send('PUT', request);
  }

  delete(request) {
    return this.send('DELETE', request);
  }
}

Http.interceptors = [];

export default Http;
