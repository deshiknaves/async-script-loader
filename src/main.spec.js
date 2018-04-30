import loadScript from './main'

const appendChild = window.document.body.appendChild

// JsDom does not call the onload method
// so we are replacing it with another function
// so that we can intercept it and call a completion handler
const mockDocument = (error = false) => {
  window.document.body.appendChild = element => {
    window.document.body.appendChild = appendChild
    window.document.body.appendChild(element)
    setTimeout(() => {
      if (error) {
        return element.onerror('Script could not be loaded')
      }

      const matches = element.src.match(/callback=(.+)$/)
      if (matches) {
        return window[matches[1]]()
      }

      element.onload()
    }, 20)
  }
}

describe('Async Script Loader', () => {
  beforeEach(() => {
    const scripts = document.querySelectorAll('script')
    scripts.forEach(script => {
      script.parentElement.removeChild(script)
    })
  })

  it('should resolve when the script is loaded correctly', done => {
    mockDocument()
    loadScript('foo').then(() => {
      const scripts = document.querySelectorAll('script')
      expect(scripts.length).toBe(1)
      expect(scripts[0].src).toEqual('foo')
      done()
    })
  })

  it('should throw an error on an error', done => {
    mockDocument(true)
    loadScript('bar').catch(err => {
      expect(err).toEqual('Script could not be loaded')
      done()
    })
  })

  it('should not append the same script more than once', done => {
    mockDocument()
    loadScript('tar')
    setTimeout(() => {
      mockDocument()
      loadScript('tar').then(() => {
        const scripts = document.querySelectorAll('script')
        expect(scripts.length).toBe(1)
        done()
      })
    }, 2)
  })

  it('should not append the same script again if reload is true', done => {
    mockDocument()
    loadScript('tar', true)
    setTimeout(() => {
      mockDocument()
      loadScript('tar', true).then(() => {
        const scripts = document.querySelectorAll('script')
        expect(scripts.length).toBe(2)
        done()
      })
    }, 2)
  })

  it('should replace the CALLBACK_PLACEHOLDER with a callback', done => {
    mockDocument()
    loadScript('car?callback=CALLBACK_PLACEHOLDER').then(() => {
      const scripts = document.querySelectorAll('script')
      expect(scripts.length).toBe(1)
      expect(scripts[0].src).toMatch(
        /car\?callback=callback_\w{8}_\w{4}_\w{4}_\w{4}_\w{12}/
      )
      done()
    })
  })
})
