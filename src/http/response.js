class Response {
  constructor(code, body, headers = {}) {
    this.code = code;
    this.body = body;
    this.headers = headers;
  }

  get json() {
    return JSON.parse(this.body);
  }

  get text() {
    return this.body;
  }

  get statusCode() {
    return parseInt(this.code);
  }

  get contentType() {
    // find the content type, case insensitively:
    const contentType = Object.keys(this.headers).filter(h => h.toLowerCase() === 'content-type');

    if (contentType) {
      return this.headers[contentType];
    }

    return null;
  }
}

export default Response;
