import uriTemplate from 'uri-templates';

class Link {
  static create(link) {
    return Object.assign(new Link(), link);
  }

  fill(params) {
    const href = this.toString();

    if (!href) {
      return href;
    }

    return uriTemplate(href).fill(params);
  }

  toString() {
    return 'href' in this ? this.href : undefined;
  }
}

export default Link;
