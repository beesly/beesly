import Http from '../http/http';
import Request from '../http/request';

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

  hasLink(name) {
    return '_links' in this.data && name in this.data._links;
  }

  getLink(name) {
    if (this.hasLink(name)) {
      return this.data._links[name];
    }
  }

  hasMore() {
    return this.hasLink('next');
  }

  paginate() {
    const request = new Request('get', this.getLink('next').href);

    return new Http().send(request).then((response) => {
      return new ResourceCollection(this.key, this.ctor, response.json);
    });
  }

  mergeWith(otherCollection) {
    const data = Object.assign({}, this.data);
    data._embedded = Object.assign({}, this.data._embedded);
    data._links = otherCollection.data._links;

    data._embedded[this.key] = data._embedded[this.key].concat(
      otherCollection.data._embedded[this.key]
    );

    return new ResourceCollection(this.key, this.ctor, data);
  }
}

export default ResourceCollection;
