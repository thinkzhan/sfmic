export function historyChange(action: any): void {
  window.addEventListener('hashchange', action)
  window.addEventListener('popstate', action)

  function polyfillHistory(fn: any): () => void {
    return function (): void {
      const before = window.location.href
      fn.apply(window.history, arguments)
      const after = window.location.href
      if (before !== after) {
        new PopStateEvent('popstate')
        action()
      }
    }
  }
  // hack: history.pushState不主动触发popstate事件
  // 调用history.pushState()或history.replaceState()不会触发popstate事件。只有在做出浏览器动作时，才会触发该事件，如用户点击浏览器的回退按钮（或者在Javascript代码中调用history.back()或者history.forward()方法）
  window.history.pushState = polyfillHistory(window.history.pushState)
  window.history.replaceState = polyfillHistory(window.history.replaceState)
}
