import type { Lifecycles, Mixin } from './types'

const mixins: Set<Mixin> = new Set()

export function mixin(mix: Mixin): void {
  if (!mixins.has(mix)) {
    mixins.add(mix)
  }
}

export function getMixin(): Lifecycles {
  const out: Lifecycles = {
    load: [],
    bootstrap: [],
    mount: [],
    unmount: []
  }
  mixins.forEach((item: Mixin) => {
    item.load && out.load!.push(item.load)
    item.bootstrap && out.bootstrap.push(item.bootstrap)
    item.mount && out.mount.push(item.mount)
    item.unmount && out.unmount.push(item.unmount)
  })
  return out
}
