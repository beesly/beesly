# beesly

> Beesly makes interacting with HAL+JSON resources a joyful experience

[![Build Status](https://img.shields.io/travis/mrkrstphr/beesly.svg?style=flat-square)](https://travis-ci.org/mrkrstphr/beesly)

A modest example:

```js
import BaseResource from 'beesly';
import {Customer, LineItem} from './resources';

export class Order extends BaseResource {
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
