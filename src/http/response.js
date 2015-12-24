class Response {
  constructor(code, body, headers) {
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
    return this.code;
  }
}

export default Response;
