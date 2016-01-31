import Link from '../../src/resource/link';

describe('Link', function linkTest() {
  describe('static create()', () => {
    it('should hydrate the link object', () => {
      let raw = {href: '/foobar', foo: 'bar', number: 2};
      let link = Link.create(raw);

      expect(link.href).toEqual('/foobar');
      expect(link.foo).toEqual('bar');
      expect(link.number).toEqual(2);
    });
  });

  describe('fill()', () => {
    it('should fill the templated href with the supplied params', () => {
      let link = Link.create({href: '/boo/{bar}/{baz}'});
      let href = link.fill({bar: 1, baz: 'two'});
      expect(href).toEqual('/boo/1/two');
    });
  });

  describe('toString()', () => {
    it('should return the href attribute', () => {
      let link = Link.create({href: '/boo'});
      expect(link.toString()).toEqual('/boo');
    });
  });
});
