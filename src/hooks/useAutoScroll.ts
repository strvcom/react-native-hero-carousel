import { useMemo, useRef, useEffect, useCallback } from 'react'
import {
  runOnJS,
  useSharedValue,
  withTiming,
  useAnimatedReaction,
  Easing,
  SharedValue,
} from 'react-native-reanimated'

import { TRANSITION_DURATION } from '../components/AutoCarousel/index.preset'

export const useAutoScroll = ({
  scrollValue,
  slideWidth,
  disableAutoScroll,
  interval,
  autoScrollEnabled,
  goToPage,
}: {
  scrollValue: SharedValue<number>
  slideWidth: number
  autoScrollEnabled: boolean
  disableAutoScroll: boolean
  interval: number | ((index: number) => number)
  goToPage: (page: number, duration?: number) => void
}) => {
  const timeoutValue = useSharedValue(0)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearCarouselTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutValue.value = 0
    }
  }, [timeoutValue])

  const handleAutoScroll = (interval: number) => {
    const offset = scrollValue.value
    const nextIndex = offset + 1
    const autoScroll = () => {
      goToPage(nextIndex, TRANSITION_DURATION)
    }
    clearCarouselTimeout()
    timeoutValue.value = withTiming(1, { duration: interval, easing: Easing.linear })
    timeoutRef.current = setTimeout(autoScroll, interval)
  }

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
      runOnJS(handleAutoScroll)(typeof interval === 'function' ? interval(offset) : interval)
    },
    [scrollValue, slideWidth, autoScrollEnabled],
  )

  return useMemo(
    () => ({
      timeoutValue,
    }),
    [timeoutValue],
  )
}
