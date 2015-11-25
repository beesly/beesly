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
      var resource = new BaseResource();
      resource.hydrate({_links: {self: {href: 'me.com'}}});

      expect(resource._links).toBeUndefined();
    });
  });
});
