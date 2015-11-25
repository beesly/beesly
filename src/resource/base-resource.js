class BaseResource {
  constructor(data) {
    if (data) {
      this.hydrate(data);
    }
  }

  hydrate(data) {
  }
}

export default BaseResource;
