import BaseResource from '../../src/resource/base-resource';

describe('BaseResource', () => {
  describe('hydrate()', () => {
    it('should hydrate the simple properties', () => {
      var resource = new BaseResource();
      resource.hydrate({foo: 1, bar: 'none'});

      expect(resource.foo).toBe(1);
      expect(resource.bar).toBe('none');
    });

    it('should hydrate embedded resources', () => {
      var resource = new BaseResource(),
        embedded = {colors: [{name: 'red'}]};
      resource.hydrate({_embedded: embedded});

      expect(resource._embedded).toBeUndefined();
      expect(resource.embeddedResources).toEqual(embedded);
    });

    it('should hydrate links', () => {
      var resource = new BaseResource(),
        links = {self: {href: 'me.com'}};

      resource.hydrate({_links: links});

      expect(resource._links).toBeUndefined();
      expect(resource.internalHalLinks).toBe(links);
    });
  });

  describe('getLink()', () => {
    it('should retrieve the link by name', () => {
      var resource = new BaseResource(),
        links = {self: {href: 'me.com'}};

      resource.hydrate({_links: links});

      expect(resource.getLink('self')).toEqual(links.self.href);
    });

    it('should return undefined if the link doesn\'t exist', () => {
      var resource = new BaseResource({self: {href: 'me.com'}});
      expect(resource.getLink('foobar')).toBeUndefined();
    });
  });

  describe('getEmbedded()', () => {
    it('should retrieve the resource by name', () => {
      var resource = new BaseResource(),
        embedded = {something: [{id: 100}]};

      resource.hydrate({_embedded: embedded});

      expect(resource.getEmbedded('something')).toEqual(embedded.something);
    });

    it('should return undefined if the resources does not exist', () => {
      var resource = new BaseResource();
      expect(resource.getEmbedded('something')).toBeUndefined();
    });

    it('should return a single, hydrated resource when configured', () => {
      var resource = new BaseResource();
      resource.hasOne('home', BaseResource);
      resource.hydrate({_embedded: {home: [{color: 'blue'}]}});

      expect(resource.getEmbedded('home')).toEqual(jasmine.any(BaseResource));
    });

    it('should return a collection of hydrated resources when configured', () => {
      var resource = new BaseResource();
      resource.hasMany('homies', BaseResource);
      resource.hydrate({_embedded: {homies: [{name: 'Clark'}, {name: 'Pineapple Face'}]}});

      expect(resource.getEmbedded('homies')).toEqual(jasmine.any(Array));
      expect(resource.getEmbedded('homies').length).toBe(2);

      resource.getEmbedded('homies').forEach((homie) => {
        expect(homie).toEqual(jasmine.any(BaseResource));
      });

    });
  });

  describe('static get()', () => {
    pit('should return a hydrated instance', () => {
      fetch.respondWith({body: {name: 'bob'}});

      BaseResource.url = 'http://foo.com/{id}';

      return BaseResource.get({id: 5}).then((resource) => {
        expect(fetch.lastUrl).toEqual('http://foo.com/5');
        expect(resource).toEqual(jasmine.any(BaseResource));
        expect(resource.name).toBe('bob');
      });
    });
  });
});
