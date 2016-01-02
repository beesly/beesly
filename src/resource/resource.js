import Http from '../http/http';
import Request from '../http/request';
import uriTemplate from 'uri-templates';

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

    var http = new Http(),
      url = uriTemplate(this.url).fill(params);

    var request = new Request(url);

    return http.get(request).then((response) => {
      return new this(response.json);
    });
  }

  create() {

  }

  update() {

  }

  delete() {

  }
}

export default Resource;
