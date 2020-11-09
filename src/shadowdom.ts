import type { App } from './types'

export function loadShadowDOM(
  app: App,
  bodyNode: HTMLTemplateElement,
  styleNodes: HTMLStyleElement[]
): Promise<DocumentFragment> {
  return new Promise((resolve) => {
    class SFMIC extends HTMLElement {
      static get tag(): string {
        return app.name
      }
      constructor() {
        super()
        app.host = this.attachShadow({ mode: 'open' })
        app.host.appendChild(bodyNode.content.cloneNode(true))
        Array.from(styleNodes)
          .reverse()
          .map((k) => {
            app.host!.insertBefore(k, app.host!.firstChild)
          })
        resolve(app.host)
      }
    }
    const hasDef = window.customElements.get(app.name)
    if (!hasDef) {
      customElements.define(app.name, SFMIC)
    }
  })
}
