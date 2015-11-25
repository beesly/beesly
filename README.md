# beasley

> Beasley makes interacting with HAL+JSON resources a joyful experience

A modest example:

```js
import BaseResource from 'beasley';
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
