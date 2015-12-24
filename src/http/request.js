class Request {
  constructor(url, data, headers) {
    this.url = url;
    this.headers = headers || {};
    this.data = data;
  }
}

export default Request;
