import type { App } from './types'

export function loadShadowDOM(app: App): Promise<DocumentFragment> {
  return new Promise((resolve) => {
    class SFMIC extends HTMLElement {
      static get tag(): string {
        return app.name
      }
      constructor() {
        super()
        resolve(this.attachShadow({ mode: 'open' }))
      }
    }
    const hasDef = window.customElements.get(app.name)
    if (!hasDef) {
      customElements.define(app.name, SFMIC)
    }
  })
}
