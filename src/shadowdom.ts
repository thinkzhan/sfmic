import type { App } from './types'
import retargetEvents from './retargetEvents'

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
        // hack:react17以下合成事件不兼容shadowdom
        if (app.fixReactEvent) {
          retargetEvents(app.host)
        }
        resolve(app.host)
      }
    }
    const hasDef = window.customElements.get(app.webComponentName)
    if (!hasDef) {
      customElements.define(app.webComponentName, SFMIC)
    }
  })
}
