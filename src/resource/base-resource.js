class BaseResource {
  constructor(data) {
    if (data) {
      this.hydrate(data);
    }
  }

  hydrate(data) {
    Object.keys(data).forEach((key) => {
      if (key === '_embedded') {
        return;
      }

      if (key === '_links') {
        return;
      }

      this[key] = data[key];
    });
  }
}

export default BaseResource;
