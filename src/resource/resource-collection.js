class ResourceCollection {
  constructor(key, ctor, data) {
    this.key = key;
    this.ctor = ctor;
    this.data = data;
  }

  get items() {
    return this.data._embedded[this.key].map((item) => {
      return new this.ctor(item); // eslint-disable-line new-cap
    });
  }
}

export default ResourceCollection;
