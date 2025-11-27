export const setPausableTimeout = (
  callback: () => void,
  delay: number,
  options?: {
    onPause?: (remaining: number) => void
    onResume?: (remaining: number) => void
  },
) => {
  const timeout = new PausableTimeout({
    callback: callback,
    delay: delay,
    onPause: options?.onPause,
    onResume: options?.onResume,
  })
  timeout.start()
  return timeout
}

export class PausableTimeout {
  callbackStartTime: number = 0
  remaining: number = 0
  paused: boolean = false
  timerId: ReturnType<typeof setTimeout> | null = null
  onPause?: (remaining: number) => void = () => {}
  onResume?: (remaining: number) => void = () => {}
  _callback: () => void
  _delay: number

  constructor(params: {
    callback: () => void
    delay: number
    onPause?: (remaining: number) => void
    onResume?: (remaining: number) => void
  }) {
    this._callback = params.callback
    this._delay = params.delay
    this.onPause = params.onPause
    this.onResume = params.onResume
  }

  pause() {
    if (!this.paused) {
      this.clear()
      this.remaining = this._delay - (new Date().getTime() - this.callbackStartTime)
      this.paused = true
      this.onPause?.(this.remaining)
    }
  }

  resume() {
    if (this.paused) {
      if (this.remaining) {
        this.onResume?.(this.remaining)
        this.paused = false
        this.callbackStartTime = new Date().getTime()
        this.timerId = setTimeout(() => {
          this.run()
        }, this.remaining)
      }
    }
  }

  clear() {
    if (this.timerId) {
      clearTimeout(this.timerId)
    }
  }

  start() {
    this.clear()
    this.callbackStartTime = new Date().getTime()
    this.timerId = setTimeout(() => {
      this.run()
    }, this._delay)
  }

  run() {
    this._callback()
  }
}
