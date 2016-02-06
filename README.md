# beesly

> Beesly makes interacting with HAL+JSON resources a joyful experience

[![Build Status](https://img.shields.io/travis/beesly/beesly.svg?style=flat-square)](https://travis-ci.org/beesly/beesly)
[![Version](https://img.shields.io/npm/v/beesly.svg?style=flat-square)](https://www.npmjs.com/package/beesly)

[Read the Documentation](https://beesly.github.io)

A modest example:

```js
import {Resource} from 'beesly';
import {Customer, LineItem} from './resources';

export class Order extends Resource {
  setup() {
    this.hasOne('customer', {class: Customer});
    this.hasMany('line_item', {class: LineItem, accessor: 'lineItems'});
  }
}
```

```js
import Order from './resources';

var order = Order.get({id: 1000});

order.lineItems().forEach((item) => {
  console.log(`${item.product().name}, ${item.quantity} units`);
})
```
