import Http from '../http/http';
import Request from '../http/request';
import ResourceCollection from './resource-collection';
import uriTemplate from 'uri-templates';

function buildCleanResource(resource) {
  let serialized = {};

  Object.keys(resource).forEach((key) => {
    if (key === 'internalHalLinks' || key === 'embeddedConfig' || key === 'embeddedResources') {
      return;
    }

    serialized[key] = resource[key];
  });

  return serialized;
}

function buildOptions(name, single, options) {
  options = options || {};

  options.single = single;
  options.name = name;

  if (!options.accessor) {
    options.accessor = name;
  }

  if (!options.class) {
    options.class = Resource;
  }

  return options;
}

function buildUri(base, params) {
  params = params || {};

  let url = uriTemplate(base).fill(params);

  if (url.substr(url.length - 1) === '/') {
    url = url.substr(0, url.length -1);
  }

  return url;
}

class Resource {
  constructor(data) {
    this.internalHalLinks = {};
    this.embeddedConfig = {};
    this.embeddedResources = {};

    this.setup();

    if (data) {
      this.hydrate(data);
    }
  }

  setup() {

  }

  hasOne(name, options) {
    this.embeddedConfig[name] = buildOptions(name, true, options);
  }

  hasMany(name, options) {
    this.embeddedConfig[name] = buildOptions(name, false, options);
  }

  getLink(name) {
    if (name in this.internalHalLinks) {
      return this.internalHalLinks[name].href;
    }
  }

  hydrate(data) {
    Object.keys(data).forEach((key) => {
      switch (key.toLowerCase()) {
        case '_embedded':
          this.hydrateEmbeddedResource(data[key]);
          break;
        case '_links':
          this.internalHalLinks = data[key];
          break;
        default:
          this[key] = data[key];
      }
    });
  }

  hydrateEmbeddedResource(collections) {
    Object.keys(collections).forEach((key) => {
      let collection = collections[key];
      let config = null;

      if (key in this.embeddedConfig) {
        config = this.embeddedConfig[key];
      } else {
        config = buildOptions(key, false);
      }

      this.embeddedResources[config.accessor] = [];

      collection.forEach((data) => {
        if (config.single) {
          this.hydrateSingleEmbeddedResource(data, config);
        } else {
          this.hydrateOneToManyEmbeddedResource(data, config);
        }
      });
    });
  }

  hydrateSingleEmbeddedResource(data, config) {
    this.embeddedResources[config.accessor] = new config.class(data);
    this.createEmbeddedAccesor(config);
  }

  hydrateOneToManyEmbeddedResource(data, config) {
    let resource = new config.class(data);
    this.embeddedResources[config.accessor].push(resource);
    this.createEmbeddedAccesor(config);
  }

  createEmbeddedAccesor(config) {
    this[config.accessor] = () => {
      return this.embeddedResources[config.accessor];
    };
  }

  static get(params) {
    if (!this.url) {
      throw 'Resource url not defined';
    }

    const request = new Request(buildUri(this.url, params));

    return new Http().get(request).then((response) => {
      return new this(response.json);
    });
  }

  static getCollection(params) {
    if (!this.url) {
      throw 'Resource url not defined';
    }

    const request = new Request(buildUri(this.url, params));

    return new Http().get(request).then((response) => {
      return new ResourceCollection(this.collectionKey, this, response.json);
    });
  }

  static create(data, params) {
    if (!this.url) {
      throw 'Resource url not defined';
    }

    const resource = buildCleanResource(data);
    const request = new Request(buildUri(this.url, params), JSON.stringify(resource));

    return new Http().post(request).then((response) => {
      return new this(response.json);
    });
  }

  update() {
    if (!this.constructor.url) {
      throw 'Resource url not defined';
    }

    const data = buildCleanResource(this);
    const request = new Request(buildUri(this.constructor.url, data), JSON.stringify(data));

    return new Http().patch(request).then((response) => {
      return new this(response.json);
    });
  }

  replace() {
    if (!this.constructor.url) {
      throw 'Resource url not defined';
    }

    const data = buildCleanResource(this);
    const request = new Request(buildUri(this.constructor.url, data), JSON.stringify(data));

    return new Http().put(request).then((response) => {
      return new this(response.json);
    });
  }

  delete() {
    if (!this.constructor.url) {
      throw 'Resource url not defined';
    }

    const request = new Request(buildUri(this.constructor.url, this));

    return new Http().delete(request).then((response) => {
      return new this(response.json);
    });
  }
}

export default Resource;
