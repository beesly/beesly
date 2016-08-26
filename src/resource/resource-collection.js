class ResourceCollection {
  constructor(key, ctor, data) {
    this.key = key;
    this.ctor = ctor;
    this.data = data;
  }

  get items() {
    if ('_embedded' in this.data && this.key in this.data._embedded) {
      return this.data._embedded[this.key].map((item) => {
        return new this.ctor(item); // eslint-disable-line new-cap
      });
    }

    return [];
  }
}

export default ResourceCollection;
