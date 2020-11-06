### Feature

- shadow dom

- scoped css

- proxy sandbox

- mixins

### Use

```html
<one-app></one-app>

<two-app></two-app>
```

```js
import { register, start } from 'sfmic'

register(
  'one-app',
  'http://localhost:3000/one.html',
  (location) => location.hash === '#/app1'
)
register(
  'two-app',
  'http://localhost:3000/two.html',
  (location) => location.hash === '#/app2'
)
start()
```

### mixins

```js
import { mixin } from 'sfmic'

mixin({
  bootstrap: () => {},
  mount: () => {},
  unmount: () => {}
})
```

