export enum Status {
  NOT_LOADED = 'NOT_LOADED',
  LOADING = 'LOADING',
  NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED',
  BOOTSTRAPPING = 'BOOTSTRAPPING',
  NOT_MOUNTED = 'NOT_MOUNTED',
  MOUNTING = 'MOUNTING',
  MOUNTED = 'MOUNTED',
  UPDATING = 'UPDATING',
  UPDATED = 'UPDATED',
  UNMOUNTING = 'UNMOUNTING'
}

export type Lifecycles = ToArray<Lifecycle>

export type Lifecycle = {
  bootstrap: PromiseFn
  unmount: PromiseFn
  mount: PromiseFn
  load?: PromiseFn
}

export type Mixin = {
  load?: PromiseFn
  mount?: PromiseFn
  unmount?: PromiseFn
  bootstrap?: PromiseFn
}

export type App = {
  name: string
  url: ((props: App['props']) => Lifecycle) | string
  match: (location: Location) => boolean
  host: DocumentFragment
  props: Record<string, unknown>
  status: Status
  loaded?: any
  store?: any
  loadLifecycle: any
  unmount: PromiseFn
  mount: PromiseFn
  bootstrap: PromiseFn
}

export type PromiseFn = (...args: any[]) => Promise<any>

export type ToArray<T> = T extends Record<any, any>
  ? {
      [K in keyof T]: T[K][]
    }
  : unknown
