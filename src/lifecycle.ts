import { App, Status } from './types'
import { getMixin } from './mixin'
import { loadHtml } from './loader'
import { loadShadowDOM } from './shadowdom'
import { historyChange } from './history'
import { lifecycleCheck, compose } from './util'

let started = false
const apps: any = new Set()

export function register(name: string, url: string, match: any): void {
  apps.add({
    name,
    url,
    match,
    status: Status.NOT_LOADED
  })
}

export function start(): void {
  started = true
  historyChange(reroute)
  reroute()
}

function reroute(): Promise<void> {
  const { loads, mounts, unmounts } = getAppsByStatus()

  return started ? update() : init()

  async function init(): Promise<void> {
    await Promise.all(loads.map(runLoad))
  }

  async function update(): Promise<void> {
    unmounts.map(runUnmount)

    loads.map(async (app) => {
      app = await runLoad(app)
      app = await runBootstrap(app)
      return runMount(app)
    })

    mounts.map(async (app) => {
      app = await runBootstrap(app)
      return runMount(app)
    })
  }
}

function getAppsByStatus(): {
  unmounts: App[]
  loads: App[]
  mounts: App[]
} {
  const unmounts: App[] = []
  const loads: App[] = []
  const mounts: App[] = []

  apps.forEach((app: App) => {
    const isActive: boolean = app.match(window.location)
    switch (app.status) {
      case Status.NOT_LOADED:
      case Status.LOADING:
        isActive && loads.push(app)
        break
      case Status.NOT_BOOTSTRAPPED:
      case Status.BOOTSTRAPPING:
      case Status.NOT_MOUNTED:
        isActive && mounts.push(app)
        break
      case Status.MOUNTED:
        !isActive && unmounts.push(app)
    }
  })
  return { unmounts, loads, mounts }
}

async function runLoad(app: App): Promise<any> {
  if (app.loaded) return app.loaded
  app.loaded = Promise.resolve().then(async () => {
    app.status = Status.LOADING
    let mixinLife = getMixin()
    app.host = await loadShadowDOM(app)
    const { lifecycle: selfLife, bodyNode, styleNodes } = await loadHtml(app)
    lifecycleCheck(selfLife)
    app.host?.appendChild(bodyNode.content.cloneNode(true))
    Array.from(styleNodes)
      .reverse()
      .map((k) => {
        app.host!.insertBefore(k, app.host!.firstChild)
      })
    app.status = Status.NOT_BOOTSTRAPPED
    app.bootstrap = compose(mixinLife.bootstrap.concat(selfLife.bootstrap))
    app.mount = compose(mixinLife.mount.concat(selfLife.mount))
    app.unmount = compose(mixinLife.unmount.concat(selfLife.unmount))
    delete app.loaded
    return app
  })
  return app.loaded
}

async function runBootstrap(app: App): Promise<App> {
  if (app.status !== Status.NOT_BOOTSTRAPPED) {
    return app
  }
  app.status = Status.BOOTSTRAPPING
  await app.bootstrap(app)
  app.status = Status.NOT_MOUNTED
  return app
}

async function runMount(app: App): Promise<App> {
  if (app.status !== Status.NOT_MOUNTED) {
    return app
  }
  app.status = Status.MOUNTING
  await app.mount(app)
  app.status = Status.MOUNTED
  return app
}

async function runUnmount(app: App): Promise<App> {
  if (app.status != Status.MOUNTED) {
    return app
  }
  app.status = Status.UNMOUNTING
  await app.unmount(app)
  app.status = Status.NOT_MOUNTED
  return app
}
