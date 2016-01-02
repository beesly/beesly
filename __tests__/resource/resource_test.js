// Http is a dependency imported by Resource.
// Jest autoMock is disabled.
// Note: do not want it globally mocked (for instance, in the Http tests themselves).
// how to mock Http just for Resource? vvv
import Resource from '../../src/resource/resource';

describe('Resource', () => {
  describe('hydrate()', () => {
    it('should hydrate the simple properties', () => {
      var resource = new Resource();
      resource.hydrate({foo: 1, bar: 'none'});

      expect(resource.foo).toBe(1);
      expect(resource.bar).toBe('none');
    });

    it('should hydrate embedded resources', () => {
      var resource = new Resource(),
        embedded = {colors: [{name: 'red'}]};
      resource.hydrate({_embedded: embedded});

      expect(resource._embedded).toBeUndefined();
      expect(Object.keys(resource.embeddedResources)).toContain('colors');
      expect(resource.embeddedResources.colors.length).toEqual(1);
      expect(resource.embeddedResources.colors[0]).toEqual(jasmine.any(Resource));
      expect(resource.embeddedResources.colors[0].name).toBe('red');
    });

    it('should hydrate links', () => {
      var resource = new Resource(),
        links = {self: {href: 'me.com'}};

      resource.hydrate({_links: links});

      expect(resource._links).toBeUndefined();
      expect(resource.internalHalLinks).toBe(links);
    });
  });

  describe('getLink()', () => {
    it('should retrieve the link by name', () => {
      var resource = new Resource(),
        links = {self: {href: 'me.com'}};

      resource.hydrate({_links: links});

      expect(resource.getLink('self')).toEqual(links.self.href);
    });

    it('should return undefined if the link doesn\'t exist', () => {
      var resource = new Resource({self: {href: 'me.com'}});
      expect(resource.getLink('foobar')).toBeUndefined();
    });
  });

  describe('embedded retrieval', () => {
    it('should return a single, hydrated resource when configured', () => {
      var resource = new Resource();
      resource.hasOne('home', {class: Resource});
      resource.hydrate({_embedded: {home: [{color: 'blue'}]}});

      expect(resource.home()).toEqual(jasmine.any(Resource));
    });

    it('should return a collection of hydrated resources when configured', () => {
      var resource = new Resource();
      resource.hasMany('homies', {class: Resource});
      resource.hydrate({_embedded: {homies: [{name: 'Clark'}, {name: 'Pineapple Face'}]}});

      expect(resource.homies()).toEqual(jasmine.any(Array));
      expect(resource.homies().length).toBe(2);

      resource.homies().forEach((homie) => {
        expect(homie).toEqual(jasmine.any(Resource));
      });

    });

    it('should use an optional relationship name', () => {
      var resource = new Resource();
      resource.hasOne('home', {class: Resource, accessor: 'homeTown'});
      resource.hydrate({_embedded: {home: [{color: 'blue'}]}});

      expect(resource.homeTown()).toEqual(jasmine.any(Resource));
    });
  });

  xdescribe('static get()', () => {
    pit('should return a hydrated instance', () => {
      Resource.url = 'http://foo.com/{id}';

      return Resource.get({id: 5}).then((resource) => {
        expect(fetch.lastUrl).toEqual('http://foo.com/5');
        expect(resource).toEqual(jasmine.any(Resource));
        expect(resource.name).toBe('bob');
      });
    });
  });
});
