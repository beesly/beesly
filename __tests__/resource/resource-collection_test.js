const Http = require('../../src/http/http').default;

Http.prototype.send = jest.genMockFn();

const Response = require('../../src/http/response').default;

const Resource = require('../../src/resource/resource').default;
const ResourceCollection = require('../../src/resource/resource-collection').default;

describe('ResourceCollection', function () {
  describe('items()', () => {
    it('should return an empty array if there is no embedded data', () => {
      let collection = new ResourceCollection('test', Resource, {});
      expect(collection.items).toEqual([]);

      collection = new ResourceCollection('test', Resource, {_embedded: {}});
      expect(collection.items).toEqual([]);
    });

    it('should return an array of Resources when embedded data is present', () => {
      const collection = new ResourceCollection('test', Resource, {
        _embedded: {
          test: [{id: 1}, {id: 2}],
        }
      });

      expect(collection.items.length).toEqual(2);

      collection.items.forEach(item => {
        expect(item instanceof Resource).toBeTruthy();
      })
    });
  });

  describe('hasLink()', () => {
    it('should return false if there are no links', () => {
      const collection = new ResourceCollection('test', Resource, {});
      expect(collection.hasLink('foo')).toBe(false);
    });

    it('should return false if there the link is not present', () => {
      const collection = new ResourceCollection('test', Resource, {_links: {foo: {href: 'bar'}}});
      expect(collection.hasLink('bar')).toBe(false);
    });

    it('should return true if the link is present', () => {
      const collection = new ResourceCollection('test', Resource, {_links: {foo: {href: 'bar'}}});
      expect(collection.hasLink('foo')).toBe(true);
    });
  });

  describe('getLink()', () => {
    it('should return undefined if the link doesn\'t exist', () => {
      const collection = new ResourceCollection('test', Resource, {});
      expect(collection.getLink('foo')).toBeUndefined();
    });

    it('should return the link', () => {
      const collection = new ResourceCollection('test', Resource, {_links: {foo: {href: 'bar'}}});
      expect(collection.getLink('foo')).toEqual({href: 'bar'});
    });
  });

  describe('hasMore()', () => {
    it('should return false if there is no next link', () => {
      const collection = new ResourceCollection('test', Resource, {});
      expect(collection.hasMore()).toBe(false);
    });

    it('should return true if there is a next link', () => {
      const collection = new ResourceCollection('test', Resource, {_links: {next: {href: 'bar'}}});
      expect(collection.hasMore()).toBe(true);
    });
  });

  describe('paginate()', () => {
    it('should make a request to the next link and return a hydrated collection', () => {
      const promise = new Promise((resolve, reject) => {
        resolve(new Response(200, '{"_embedded": {"foo": [{"id": 10}, {"id": 20}]}}', {"Content-Type": 'application/hal+json'}));
      });

      Http.prototype.send.mockReturnValueOnce(promise);

      const collection = new ResourceCollection('foo', Resource, {_links: {next: {href: 'bar'}}});

      const responsePromise = collection.paginate().then((resource) => {
        expect(resource).toEqual(jasmine.any(ResourceCollection));
        expect(resource.data).toEqual({
          _embedded: {
            foo: [
              {id: 10},
              {id: 20},
            ],
          },
        });
      });

      let request = Http.prototype.send.mock.calls[0][0];
      expect(request.url).toEqual('bar');

      return responsePromise;
    });
  });

  describe('mergeWith()', () => {
    it('should return a new resource collection with merged embedded resources', () => {
      const myCollection = new ResourceCollection('hello', Resource, {_embedded: {hello: [
        {id: 100}, {id: 200},
      ]}});
      const myOtherCollection = new ResourceCollection('hello', Resource, {_embedded: {hello: [
        {id: 300}, {id: 400},
      ]}});
      const mergedCollection = myCollection.mergeWith(myOtherCollection);
      expect(mergedCollection.data._embedded['hello'].map((h => h.id)))
        .toEqual([100, 200, 300, 400]);
    });

    it('should return a new resource collection with the merged collections links', () => {
      const myCollection = new ResourceCollection('hello', Resource, {
        _embedded: {hello: []},
        _links: {foo: 'bar'},
      });
      const myOtherCollection = new ResourceCollection('hello', Resource, {
        _embedded: {hello: []},
        _links: {foo: 'bar2'},
      });
      const mergedCollection = myCollection.mergeWith(myOtherCollection);
      expect(mergedCollection.data._links).toEqual({foo: 'bar2'});
    });

    it('should not mutate the original two collections', () => {
      const myCollection = new ResourceCollection('hello', Resource, {
        _embedded: {hello: [{id: 100}, {id: 200}]},
        _links: {foo: 'bar'},
      });
      const myOtherCollection = new ResourceCollection('hello', Resource, {
        _embedded: {hello: [{id: 300}, {id: 400}]},
        _links: {foo: 'bar2'},
      });
      const mergedCollection = myCollection.mergeWith(myOtherCollection);
      expect(myCollection.data._embedded['hello'].map((h => h.id))).toEqual([100, 200]);
      expect(myOtherCollection.data._embedded['hello'].map((h => h.id))).toEqual([300, 400]);
      expect(myCollection.data._links).toEqual({foo: 'bar'});
      expect(myOtherCollection.data._links).toEqual({foo: 'bar2'});
    });
  });
});
