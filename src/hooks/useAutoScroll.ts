import { useMemo, useRef, useEffect, useCallback } from 'react'
import {
  runOnJS,
  withTiming,
  useAnimatedReaction,
  Easing,
  SharedValue,
} from 'react-native-reanimated'

import { TRANSITION_DURATION } from '../components/AutoCarousel/index.preset'

export class IntervalTimer {
  callbackStartTime: number = 0
  remaining: number = 0
  paused: boolean = false
  timerId: NodeJS.Timeout | null = null
  onPause?: (remaining: number) => void = () => {}
  onResume?: (remaining: number) => void = () => {}
  _callback: () => void
  _delay: number

  constructor(
    callback: () => void,
    delay: number,
    onPause?: (remaining: number) => void,
    onResume?: (remaining: number) => void,
  ) {
    this._callback = callback
    this._delay = delay
    this.onPause = onPause
    this.onResume = onResume
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
        setTimeout(() => {
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

export const useAutoScroll = ({
  scrollValue,
  slideWidth,
  disableAutoScroll,
  interval,
  autoScrollEnabled,
  goToPage,
  timeoutValue,
}: {
  scrollValue: SharedValue<number>
  slideWidth: number
  autoScrollEnabled: boolean
  disableAutoScroll: boolean
  interval: number | ((index: number) => number)
  goToPage: (page: number, duration?: number) => void
  timeoutValue: SharedValue<number>
}) => {
  const timeoutRef = useRef<IntervalTimer | null>(null)

  const clearCarouselTimeout = useCallback(() => {
    if (timeoutRef.current) {
      timeoutRef.current.clear()
      timeoutValue.value = 0
    }
  }, [timeoutValue])

  const runAutoScroll = useCallback(
    (
      interval: number,
      onComplete = (nextIndex: number) => {
        goToPage(nextIndex, TRANSITION_DURATION)
      },
    ) => {
      const offset = scrollValue.value
      const nextIndex = offset + 1
      const autoScroll = () => {
        onComplete(nextIndex)
      }
      clearCarouselTimeout()
      timeoutValue.value = withTiming(1, { duration: interval, easing: Easing.linear })
      timeoutRef.current = new IntervalTimer(
        autoScroll,
        interval,
        () => {
          timeoutValue.value = timeoutValue.value
        },
        (remaining) => {
          timeoutValue.value = withTiming(1, {
            duration: remaining,
            easing: Easing.linear,
          })
        },
      )
      timeoutRef.current.start()
      return timeoutRef.current
    },
    [clearCarouselTimeout, goToPage, scrollValue, timeoutValue],
  )

  useEffect(() => {
    if (!autoScrollEnabled) clearCarouselTimeout()
    return () => {
      clearCarouselTimeout()
    }
  }, [autoScrollEnabled, clearCarouselTimeout])

  useAnimatedReaction(
    () => scrollValue.value,
    (offset) => {
      if (slideWidth === 0) return
      if (offset % 1 !== 0) return
      if (!autoScrollEnabled) return
      timeoutValue.value = 0
      if (disableAutoScroll) return
      runOnJS(runAutoScroll)(typeof interval === 'function' ? interval(offset) : interval)
    },
    [scrollValue, slideWidth, autoScrollEnabled],
  )

  return useMemo(
    () => ({
      timeoutValue,
      runAutoScroll,
    }),
    [timeoutValue, runAutoScroll],
  )
}
