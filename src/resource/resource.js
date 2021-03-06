import Http from '../http/http';
import Link from './link';
import Request from '../http/request';
import ResourceCollection from './resource-collection';
import uriTemplate from 'uri-templates';

function buildCleanResource(resource) {
  const serialized = {};

  Object.keys(resource).forEach((key) => {
    if (key === 'internalHalLinks' || key === 'embeddedConfig' || key === 'embeddedResources') {
      return;
    }

    if (typeof resource[key] === 'function') {
      return;
    }

    serialized[key] = resource[key];
  });

  return serialized;
}

function buildOptions(name, single, options) {
  const config = options || {};

  config.single = single;
  config.name = name;

  if (!config.accessor) {
    config.accessor = name;
  }

  if (!config.class) {
    config.class = Resource; // eslint-disable-line no-use-before-define
  }

  return config;
}

function buildUri(base, params, qs) {
  const urlParams = params || {};
  const queryString = qs || {};

  let url = uriTemplate(base).fill(urlParams);

  if (url.substr(url.length - 1) === '/') {
    url = url.substr(0, url.length - 1);
  }

  if (Object.keys(queryString).length) {
    const stringy = Object.keys(queryString).map(key => `${key}=${queryString[key]}`).join('&');
    url += `?${stringy}`;
  }

  return url;
}

function makeHttpRequest(request, className) {
  return new Promise((resolve, reject) => {
    return new Http().send(request).then((response) => {
      if (response.statusCode !== 204 && response.contentType === 'application/hal+json') {
        resolve(new className(response.json)); // eslint-disable-line new-cap
      } else {
        resolve(null);
      }
    }).catch((error) => {
      reject(error);
    });
  });
}

const getDefaultEmbeddedValue = (config) => {
  return config.single ? undefined : [];
};

const setEmbeddedData = (resource, config, data) => {
  if (Array.isArray(data)) {
    if (config.single) {
      resource.embeddedResources[config.accessor] = data[0];
    } else {
      resource.embeddedResources[config.accessor] = data;
    }
  } else {
    if (config.single) {
      resource.embeddedResources[config.accessor] = data;
    } else {
      resource.embeddedResources[config.accessor].push(data);
    }
  }
};

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
    this.createEmbeddedAccesor(this.embeddedConfig[name]);
  }

  hasMany(name, options) {
    this.embeddedConfig[name] = buildOptions(name, false, options);
    this.createEmbeddedAccesor(this.embeddedConfig[name]);
  }

  getLink(name) {
    if (name in this.internalHalLinks) {
      return this.internalHalLinks[name];
    }
  }

  hydrate(data) {
    Object.keys(data).forEach((key) => {
      switch (key.toLowerCase()) {
        case '_embedded':
          this.hydrateEmbeddedResource(data[key]);
          break;
        case '_links':
          Object.keys(data._links).forEach((index) => {
            this.internalHalLinks[index] = Link.create(data._links[index]);
          });
          break;
        default:
          this[key] = data[key];
      }
    });
  }

  hydrateEmbeddedResource(collections) {
    Object.keys(collections).forEach((key) => {
      const collection = collections[key];
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
    this.embeddedResources[config.accessor] = new config.class(data); // eslint-disable-line new-cap
    this.createEmbeddedAccesor(config);
  }

  hydrateOneToManyEmbeddedResource(data, config) {
    const resource = new config.class(data); // eslint-disable-line new-cap
    this.embeddedResources[config.accessor].push(resource);
    this.createEmbeddedAccesor(config);
  }

  get rawData() {
    return buildCleanResource(this);
  }

  createEmbeddedAccesor(config) {
    this[config.accessor] = (data) => {
      if (typeof data !== 'undefined') {
        setEmbeddedData(this, config, data);
      }

      return config.accessor in this.embeddedResources ?
        this.embeddedResources[config.accessor] : getDefaultEmbeddedValue(config);
    };
  }

  static get(params, qs) {
    if (!this.url) {
      throw new Error('Resource url not defined');
    }

    const request = new Request('get', buildUri(this.url, params, qs));
    return makeHttpRequest(request, this);
  }

  static getCollection(params, qs) {
    if (!this.url) {
      throw new Error('Resource url not defined');
    }

    const request = new Request('get', buildUri(this.url, params, qs));

    return new Http().send(request).then((response) => {
      return new ResourceCollection(this.collectionKey, this, response.json);
    });
  }

  static create(data, params) {
    if (!this.url) {
      throw new Error('Resource url not defined');
    }

    let url = this.url;

    if (this.urlOverrides && this.urlOverrides.POST) {
      url = this.urlOverrides.POST;
    }

    const resource = buildCleanResource(data);
    const request = new Request('post', buildUri(url, params), JSON.stringify(resource));
    request.setHeader('Content-Type', 'application/json');

    return makeHttpRequest(request, this);
  }

  update() {
    if (!this.constructor.url) {
      throw new Error('Resource url not defined');
    }

    const data = buildCleanResource(this);
    const request = new Request(
      'patch',
      buildUri(this.constructor.url, data),
      JSON.stringify(data)
    );
    request.setHeader('Content-Type', 'application/json');

    return makeHttpRequest(request, this.constructor);
  }

  replace() {
    if (!this.constructor.url) {
      throw new Error('Resource url not defined');
    }

    const data = buildCleanResource(this);
    const request = new Request(
      'put',
      buildUri(this.constructor.url, data),
      JSON.stringify(data)
    );
    request.setHeader('Content-Type', 'application/json');

    return makeHttpRequest(request, this.constructor);
  }

  delete() {
    if (!this.constructor.url) {
      throw new Error('Resource url not defined');
    }

    const request = new Request('delete', buildUri(this.constructor.url, this));
    return makeHttpRequest(request, this.constructor);
  }
}

export default Resource;
