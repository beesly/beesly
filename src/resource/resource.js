import Http from '../http/http';
import Request from '../http/request';
import uriTemplate from 'uri-templates';

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

  hasOne(name, ctor, key) {
    var config = {
      single: true,
      name: name,
      key: key || name
    };

    if (ctor) {
      config.ctor = ctor;
    }

    this.embeddedConfig[name] = config;
  }

  hasMany(name, ctor, key) {
    var config = {
      single: false,
      name: name,
      key: key || name
    };

    if (ctor) {
      config.ctor = ctor;
    }

    this.embeddedConfig[name] = config;
  }

  getLink(name) {
    if (name in this.internalHalLinks) {
      return this.internalHalLinks[name].href;
    }
  }

  getEmbedded(name) {
    if (name in this.embeddedResources) {
      return this.embeddedResources[name];
    }
  }

  // @todo @fixme refactor this mess
  hydrate(data) {
    Object.keys(data).forEach((key) => {
      if (key === '_embedded') {
        Object.keys(data[key]).forEach((embeddedKey) => {
          let collection = data[key][embeddedKey];

          collection.forEach((embeddedData) => {
            let configuredKey = embeddedKey;

            if (embeddedKey in this.embeddedConfig) {
              configuredKey = this.embeddedConfig[embeddedKey].key;

              if (this.embeddedConfig[embeddedKey].single) {
                this.embeddedResources[configuredKey] = new this.embeddedConfig[embeddedKey].ctor(embeddedData);
                this[configuredKey] = () => {
                  return this.embeddedResources[configuredKey];
                };
                return;
              } else {
                embeddedData = new this.embeddedConfig[embeddedKey].ctor(embeddedData);
              }
            }

            if (!(configuredKey in this.embeddedResources)) {
              this.embeddedResources[configuredKey] = [];
            }

            this[configuredKey] = () => {
              return this.embeddedResources[configuredKey];
            };

            this.embeddedResources[configuredKey].push(embeddedData);
          });
        });

        return;
      }

      if (key === '_links') {
        this.internalHalLinks = data[key];
        return;
      }

      this[key] = data[key];
    });
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
