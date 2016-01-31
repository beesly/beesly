class Request {
  constructor(method, url, content, headers) {
    this.method = method;
    this.url = url;
    this.headers = headers || {};
    this.content = content;
  }

  hasHeader(header) {
    return header in this.headers;
  }

  getHeader(header) {
    if (this.hasHeader(header)) {
      return this.headers[header];
    }
  }

  setHeader(name, value) {
    this.headers[name] = value;
  }
}

export default Request;
