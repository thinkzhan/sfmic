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
  (location) => location.hash === '#/app1',
  {
    prop1: 'props'
  }
)
register(
  'two-app',
  'http://localhost:3000/two.html',
  (location) => location.hash === '#/app2'
)
// want to reuse the same app?
register(
  'two-app',
  'http://localhost:3000/two.html',
  (location) => location.hash === '#/app3'
).alias('other-name')
//
start()
```

### child

```js
// in vue, for webcomponents
Vue.config.ignoredElements = ['one-app', 'two-app']

export async function bootstrap() {}

export async function mount({ host, props }) {}

export async function unmount({ host }) {}

if (!window.IS_SFMIC_SANDBOX) {
  // mount
}
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

### shadow DOM 的问题

比如如果使用的基础依赖的组件库，并没有设计让 Dialog 等弹出层在指定的 dom 节点中插入结构的话，弹出层都是会逃离你当前的 shadow DOM。逃离之后，它就是一个无样式的弹框。这种无样式的弹框对于业务上来说是不可以接受的，因此弹框逻辑需要去做一些兼容，更甚至需要对底层组件去做改造。

在 React 场景下，shadow DOM 的使用会涉及到事件机制的问题，因为 React 的事件机制是代理到 document 的，但基于 shadow DOM 处理的话，它可能会阻断事件到它的 host 层，也就是你渲染 shadow DOM 的那一层。虽然说社区也有对应的包去做一些兼容处理，但它对业务上来说还是会有一些实现成本。

除此之外还包括其它的问题。比如 CSS @font-face，或者说一些字体属性，svg 都会有一个不兼容的场景
