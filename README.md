# beesly

> Beesly makes interacting with HAL+JSON resources a joyful experience

[![Build Status](https://travis-ci.org/mrkrstphr/beasley.svg?branch=master)](https://travis-ci.org/mrkrstphr/beasley)

A modest example:

```js
import BaseResource from 'beesly';
import {Customer, LineItem} from './resources';

export class Order extends BaseResource {
  setup() {
    this.hasOne('customer', Customer);
    this.hasMany('line_item', LineItem);
  }
}
```

```js
import Order from './order-resource';

var order = Order.get({id: 1000});

order.lineItems.forEach((item) => {
  console.log(`${item.product.name}, ${item.quantity} units`);
})
```
