class BaseResource {
  constructor(data) {
    this.internalHalLinks = {};

    if (data) {
      this.hydrate(data);
    }
  }

  getLink(name) {
    if (name in this.internalHalLinks) {
      return this.internalHalLinks[name].href;
    }
  }

  hydrate(data) {
    Object.keys(data).forEach((key) => {
      if (key === '_embedded') {
        return;
      }

      if (key === '_links') {
        this.internalHalLinks = data[key];
        return;
      }

      this[key] = data[key];
    });
  }
}

export default BaseResource;
