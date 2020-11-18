export function run(code: string, options: any = {}): any {
  try {
    const handler = {
      get(obj: any, prop: string): any {
        return Reflect.has(obj, prop) ? obj[prop] : null
      },
      set(obj: any, prop: string, value: any): boolean {
        Reflect.set(obj, prop, value)
        return true
      },
      has(obj: any, prop: string): boolean {
        return obj && Reflect.has(obj, prop)
      }
    }
    const captureHandler = {
      get(obj: any, prop: string): any {
        return Reflect.get(obj, prop)
      },
      set(): boolean {
        return true
      },
      has(): boolean {
        return true
      }
    }

    const allowList = {
      IS_SFMIC_SANDBOX: true,
      __proto__: null,
      console,
      String,
      Number,
      Array,
      Boolean,
      Symbol,
      Math,
      Object,
      Promise,
      RegExp,
      JSON,
      Date,
      Function,
      parseInt,
      parseFloat,
      document,
      navigator,
      location,
      performance,
      MessageChannel,
      SVGElement,
      HTMLElement,
      Element,
      HTMLDivElement,
      HTMLIFrameElement,
      history,
      NaN,
      isNaN,
      isFinite,
      Map,
      Set,
      WeakMap,
      WeakSet,
      ArrayBuffer,
      Uint8Array,
      Int32Array,
      Uint32Array,
      Error,
      localStorage,
      sessionStorage,
      decodeURI,
      encodeURI,
      decodeURIComponent,
      encodeURIComponent,
      XMLHttpRequest,
      fetch: fetch.bind(window),
      setTimeout: setTimeout.bind(window),
      clearTimeout: clearTimeout.bind(window),
      setInterval: setInterval.bind(window),
      clearInterval: clearInterval.bind(window),
      requestAnimationFrame: requestAnimationFrame.bind(window),
      cancelAnimationFrame: cancelAnimationFrame.bind(window),
      addEventListener: addEventListener.bind(window),
      removeEventListener: removeEventListener.bind(window),
      eval: function (c: string): any {
        return run('return ' + c, {})
      },
      alert: function (): void {
        alert(arguments[0])
      },
      getComputedStyle: getComputedStyle.bind(window),
      innerHeight,
      innerWidth,
      outerHeight,
      outerWidth,
      pageXOffset,
      pageYOffset,
      screen,
      screenLeft,
      screenTop,
      screenX,
      screenY,
      scrollBy,
      scrollTo,
      scrollX,
      scrollY,
      ...(options.allowList || {})
    }

    if (!Object.isFrozen(String.prototype)) {
      for (const k in allowList) {
        const fn = allowList[k]
        if (typeof fn === 'object' && fn && fn.prototype) {
          Object.freeze(fn.prototype)
        }
        if (typeof fn === 'function') {
          Object.freeze(fn)
        }
      }
    }
    const proxy = new Proxy(allowList, handler)
    const capture = new Proxy(
      {
        __proto__: null,
        proxy,
        globalThis: new Proxy(allowList, handler),
        window: new Proxy(allowList, handler),
        self: new Proxy(allowList, handler)
      },
      captureHandler
    )
    return Function(
      'proxy',
      'capture',
      `with(capture) {     
          with(proxy) {  
            return (function(){                                               
              "use strict";
              ${code};
              return window
            })();
          }
      }`
    )(proxy, capture)
  } catch (e) {
    throw e
  }
}
