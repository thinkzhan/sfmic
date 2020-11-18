// @ts-nocheck
const reactEvents = [
  'onAbort',
  'onAnimationCancel',
  'onAnimationEnd',
  'onAnimationIteration',
  'onAuxClick',
  'onBlur',
  'onChange',
  'onClick',
  'onClose',
  'onContextMenu',
  'onDoubleClick',
  'onError',
  'onFocus',
  'onGotPointerCapture',
  'onInput',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onLoad',
  'onLoadEnd',
  'onLoadStart',
  'onLostPointerCapture',
  'onMouseDown',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onPointerCancel',
  'onPointerDown',
  'onPointerEnter',
  'onPointerLeave',
  'onPointerMove',
  'onPointerOut',
  'onPointerOver',
  'onPointerUp',
  'onReset',
  'onResize',
  'onScroll',
  'onSelect',
  'onSelectionChange',
  'onSelectStart',
  'onSubmit',
  'onTouchCancel',
  'onTouchMove',
  'onTouchStart',
  'onTouchEnd',
  'onTransitionCancel',
  'onTransitionEnd',
  'onDrag',
  'onDragEnd',
  'onDragEnter',
  'onDragExit',
  'onDragLeave',
  'onDragOver',
  'onDragStart',
  'onDrop',
  'onFocusOut'
]

const divergentNativeEvents = {
  onDoubleClick: 'dblclick'
}

const mimickedReactEvents = {
  onInput: 'onChange',
  onFocusOut: 'onBlur',
  onSelectionChange: 'onSelect'
}

export default function retargetEvents(shadowRoot: DocumentFragment): any {
  const removeEventListeners: [] = []

  reactEvents.forEach(function (reactEventName: any): any {
    const nativeEventName = getNativeEventName(reactEventName)

    function retargetEvent(event: any): any {
      let path =
        event.path ||
        (event.composedPath && event.composedPath()) ||
        composedPath(event.target)

      for (let i = 0; i < path.length; i++) {
        const el = path[i]
        let props = null
        const reactComponent = findReactComponent(el)
        const eventHandlers = findReactEventHandlers(el)

        if (!eventHandlers) {
          props = findReactProps(reactComponent)
        } else {
          props = eventHandlers
        }

        if (reactComponent && props) {
          dispatchEvent(event, reactEventName, props)
        }
        if (reactComponent && props && mimickedReactEvents[reactEventName]) {
          dispatchEvent(event, mimickedReactEvents[reactEventName], props)
        }

        if (event.cancelBubble) {
          break
        }

        if (el === shadowRoot) {
          break
        }
      }
    }

    shadowRoot.addEventListener(nativeEventName, retargetEvent, false)

    removeEventListeners.push(function () {
      shadowRoot.removeEventListener(nativeEventName, retargetEvent, false)
    })
  })

  return function (): void {
    removeEventListeners.forEach(function (removeEventListener) {
      removeEventListener()
    })
  }
}

function findReactEventHandlers(item: DocumentFragment): any {
  return findReactProperty(item, '__reactEventHandlers')
}

function findReactComponent(item: DocumentFragment): any {
  return findReactProperty(item, '_reactInternal')
}

function findReactProperty(
  item: DocumentFragment,
  propertyPrefix: string
): any {
  for (let key in item) {
    if (item.hasOwnProperty(key) && key.indexOf(propertyPrefix) !== -1) {
      return item[key]
    }
  }
}

function findReactProps(component: any): any {
  if (!component) return undefined
  if (component.memoizedProps) return component.memoizedProps // React 16 Fiber
  if (component._currentElement && component._currentElement.props)
    return component._currentElement.props // React <=15
}

function dispatchEvent(
  event: any,
  eventType: string,
  componentProps: any
): any {
  event.persist = function (): void {
    event.isPersistent = function (): boolean {
      return true
    }
  }
  if (componentProps[eventType]) {
    componentProps[eventType](event)
  }
}

function getNativeEventName(reactEventName: string): any {
  if (divergentNativeEvents[reactEventName]) {
    return divergentNativeEvents[reactEventName]
  }
  return reactEventName.replace(/^on/, '').toLowerCase()
}

function composedPath(el: any): any {
  let path = []
  while (el) {
    path.push(el)
    if (el.tagName === 'HTML') {
      path.push(document)
      path.push(window)
      return path
    }
    el = el.parentElement
  }
}
