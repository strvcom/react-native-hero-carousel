import { useMemo, useRef, useEffect, useCallback } from 'react'
import {
  runOnJS,
  withTiming,
  useAnimatedReaction,
  Easing,
  SharedValue,
} from 'react-native-reanimated'

import { TRANSITION_DURATION } from '../components/HeroCarousel/index.preset'
import { PausableTimeout, setPausableTimeout } from '../utils/PausableTimeout'

export const useAutoScroll = ({
  scrollValue,
  slideWidth,
  disableAutoScroll,
  interval,
  totalLength,
  autoScrollEnabled,
  goToPage,
  timeoutValue,
}: {
  scrollValue: SharedValue<number>
  slideWidth: number | undefined
  autoScrollEnabled: boolean
  disableAutoScroll: boolean
  interval: number | ((index: number) => number)
  totalLength: number
  goToPage: (page: number, duration?: number) => void
  timeoutValue: SharedValue<number>
}) => {
  const timeoutRef = useRef<PausableTimeout | null>(null)

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
      if (nextIndex >= totalLength) {
        return
      }
      const autoScroll = () => {
        onComplete(nextIndex)
      }
      clearCarouselTimeout()
      timeoutValue.value = withTiming(1, { duration: interval, easing: Easing.linear })
      timeoutRef.current = setPausableTimeout(autoScroll, interval, {
        onPause: () => {
          timeoutValue.value = timeoutValue.value
        },
        onResume: (remaining) => {
          timeoutValue.value = withTiming(1, {
            duration: remaining,
            easing: Easing.linear,
          })
        },
      })
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
      timeoutRef,
    }),
    [timeoutValue, runAutoScroll, timeoutRef],
  )
}
