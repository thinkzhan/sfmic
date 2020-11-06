import { start, register, mixin } from '../../dist/sfmic'
import React from 'react'
import { render } from 'react-dom'
import './index.css'

import App from './App'

window.test = 'parent'
console.log('parent: ', window.test)

const isProduction = process.env.NODE_ENV === 'production'

render(<App />, document.getElementById('app'))

mixin({
  bootstrap: (e) => {
    console.error('mixin bootstrap', e)
  },
  mount: (e) => {
    console.error('mixin mount', e)
  },
  unmount: () => {
    console.error('mixin unmount')
  }
})

register(
  'child-react',
  isProduction ? '' : 'http://localhost:3002',
  (location) => /^\/react/.test(location.pathname)
)

register('child-vue', isProduction ? '' : 'http://localhost:3003', (location) =>
  /^\/vue/.test(location.pathname)
)

start()
