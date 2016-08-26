
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
});
