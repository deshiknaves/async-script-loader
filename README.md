[![Build Status](https://travis-ci.org/deshiknaves/async-script-loader.svg?branch=master)](https://travis-ci.org/deshiknaves/async-script-loader)

# Async Script Loader

The package will append a script to the body and load it asynchronously.

There are a few other packages that do very similar things, however, I've found them all to load the script every time it is requested. A lot of the time the intention is to load the script once and then resolve immediately if it is already resolved. For example a React component that needs to load a 3rd party library for it work can load it every time the component is used, but the script will only be appended once (the behavior can be overwritten).

## Basic Usage

Simply import the module and pass it the src to load.

```javascript
import asyncScriptLoader from 'async-script-loader'

asyncScriptLoader('https://url.to/script.js')
      .then(() => {
        console.log('script has been loaded')
      })
      .catch(err => console.log(err))
```

## Callback

Some scripts provide can take a callback that is executed once the script is loaded and ready for use (e.g. Google Maps). Just set the callback as `CALLBACK_PLACEHOLDER` and it will replaced with one when executing. The returned Promise will be resolved when that callback is called instead of when the script has been loaded.

```javascript
import asyncScriptLoader from 'async-script-loader'

asyncScriptLoader('https://url.to/script.js?callback=CALLBACK_PLACEHOLDER')
      .then(() => {
        console.log('script has been loaded')
      })
      .catch(err => console.log(err))
```

## Loading Everytime

If you want to load the script every time it is requested, simply:

```javascript
import asyncScriptLoader from 'async-script-loader'

asyncScriptLoader('https://url.to/script.js', true) // Second parameter is reload
      .then(() => {
        console.log('script has been loaded')
      })
      .catch(err => console.log(err))
```
