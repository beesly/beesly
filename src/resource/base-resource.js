import request from 'superagent';

export default class BaseResource {
  constructor(data) {
    this.internalHalLinks = {};
    this.embeddedConfig = {};
    this.embeddedResources = {};

    if (data) {
      this.hydrate(data);
    }
  }

  hasOne(name, ctor) {
    var config = {single: true};

    if (ctor) {
      config.ctor = ctor;
    }

    this.embeddedConfig[name] = config;
  }

  hasMany(name, ctor) {
    var config = {single: false};

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

  hydrate(data) {
    Object.keys(data).forEach((key) => {
      if (key === '_embedded') {
        Object.keys(data[key]).forEach((embeddedKey) => {
          let collection = data[key][embeddedKey];

          collection.forEach((embeddedData) => {

            if (!(embeddedKey in this.embeddedResources)) {
              this.embeddedResources[embeddedKey] = [];
            }

            if (embeddedKey in this.embeddedConfig) {
              if (this.embeddedConfig[embeddedKey].single) {
                this.embeddedResources[embeddedKey] = new this.embeddedConfig[embeddedKey].ctor(embeddedData);
                return;
              } else {
                embeddedData = new this.embeddedConfig[embeddedKey].ctor(embeddedData);
              }
            }

            this.embeddedResources[embeddedKey].push(embeddedData);
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
    return new Promise((resolve, reject) => {
      request
        .get('url.com')
        .end((err, res) => {
          if (err) {
            reject(err)
          }

          resolve(new this(res.body));
        });
    });

    return def.promise;
  }
}
