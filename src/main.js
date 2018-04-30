import uuid from 'uuid/v4'

const LOADED = 'loaded'
const ERROR = 'error'

const scriptMap = new Map()

/**
 * Clean up the callback
 *
 * @param {string} callback The callback function name
 *
 * @return {void}
 */
const cleanup = callback => {
  if (!window[callback] || typeof window[callback] !== 'function') {
    return
  }

  window[callback] = null
}

/**
 * Load a script asynchronously
 *
 * @param {string} script The script to load
 * @param {bool} reload If the script should be loaded even if it was loaded before
 *
 * @return {Promise}
 */
export const load = (script, reload = false) => {
  let src = script
  const id = uuid()
  const key = reload ? `${script}${id}` : script
  if (scriptMap.has(key)) {
    const item = scriptMap.get(key)
    if (item.promise) {
      return item.promise
    }

    if (item.error) {
      return Promise.resolve(item.error)
    }

    return Promise.resolve(null, item)
  }

  const callbackName = `callback_${uuid().replace(/-/g, '_')}`
  const tag = window.document.createElement('script')
  tag.type = 'text/javascript'
  tag.async = false

  // Create the promise to return if it is already
  // resolving
  const promise = new Promise((resolve, reject) => {
    const handleResult = state => evt => {
      const instance = scriptMap.get(key)
      if (state === LOADED) {
        instance.loaded = true
        resolve(evt)
      } else if (state === ERROR) {
        instance.error = evt
        reject(evt)
      }

      instance.promise = null
      scriptMap.set(key, instance)
      cleanup(callbackName)
    }

    // Add error handlers
    tag.onerror = handleResult(ERROR)
    tag.onreadystatechange = () => {
      handleResult(tag.readyState)
    }

    // Replace callback if there is one
    // or just resolve the promise
    if (script.match(/callback=CALLBACK_PLACEHOLDER/)) {
      src = src.replace(/(callback=)[^&]+/, `$1${callbackName}`)
      window[callbackName] = handleResult(LOADED)
    } else {
      tag.onload = handleResult(LOADED)
      tag.addEventListener('load', tag.onload)
    }

    // Start loading the script
    tag.src = src
    window.document.body.appendChild(tag)
  })

  const initialState = {
    loaded: false,
    error: false,
    promise,
  }

  scriptMap.set(key, initialState)

  return promise
}

export default load
