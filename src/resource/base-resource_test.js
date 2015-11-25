import BaseResource from './base-resource';

describe('BaseResource', () => {
  describe('hydrate()', () => {
    it('should hydrate the simple properties', () => {
      var resource = new BaseResource();
      resource.hydrate({foo: 1, bar: 'none'});

      expect(resource.foo).toBe(1);
      expect(resource.bar).toBe('none');
    });

    it('should hydrate embedded resources', function () {
      var resource = new BaseResource();
      resource.hydrate({_embedded: {colors: [{name: 'red'}]}});

      expect(resource._embedded).toBeUndefined();
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
});
