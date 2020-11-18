import type { Lifecycle, Lifecycles, App } from './types'

export function error(msg: any): void {
  throw new Error(`[SFMIC: Error]: ${msg}`)
}

export function request(url: string, option?: RequestInit): Promise<string> {
  if (!window.fetch) {
    error(
      "It looks like that your browser doesn't support fetch. Polyfill is needed before you use it."
    )
  }

  return fetch(url, {
    mode: 'cors',
    ...option
  }).then((res) => res.text())
}

export function lifecycleCheck(lifecycle: Lifecycle | Lifecycles): void {
  const keys = ['bootstrap', 'mount', 'unmount']
  keys.forEach((key: any) => {
    // @ts-ignore
    if (!(key in lifecycle && lifecycle[key] && lifecycle[key].length)) {
      error(`It looks like that you didn't export the lifecycle hook [${key}].`)
    }
  })
}

export function compose(
  fns: ((app: App) => Promise<any>)[]
): (app: App) => Promise<void> {
  fns = Array.isArray(fns) ? fns : [fns]
  return (app: App): Promise<void> =>
    fns.reduce((p, fn) => p.then(() => fn(app)), Promise.resolve())
}
