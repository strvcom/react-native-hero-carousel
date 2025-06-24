import React, { useRef, useEffect, useCallback } from 'react'
import {
  runOnJS,
  useSharedValue,
  withTiming,
  useAnimatedReaction,
  Easing,
} from 'react-native-reanimated'

import { DEFAULT_INTERVAL, ROUNDING_PRECISION, TRANSITION_DURATION } from './index.preset'
import { useCarouselContext } from '../../context/CarouselContext'
import { AutoCarouselSlide } from '../AutoCarouselSlide'
import { customRound } from '../../utils/round'
import { AutoCarouselAdapter } from '../AnimatedPagedView/Adapter'

export type AutoCarouselProps = {
  interval?: number
  children: React.ReactNode[]
}

export const AutoCarousel = ({ interval = DEFAULT_INTERVAL, children }: AutoCarouselProps) => {
  const { scrollValue, userInteracted, slideWidth, timeoutValue } = useCarouselContext()
  const offset = useSharedValue({ value: slideWidth })

  const childrenArray = React.Children.toArray(children)

  const autoScrollEnabled = !userInteracted

  // need to clone first and last element to have infinite scrolling both ways
  // if it gets to the end we switch back to the start without animation and vice versa
  const paddedChildrenArray = [
    childrenArray[childrenArray.length - 1],
    ...childrenArray,
    childrenArray[0],
  ]

  const goToPage = useCallback(
    (page: number, duration = 0) => {
      'worklet'
      const to = page * slideWidth
      if (duration) {
        offset.value = withTiming<{ value: number }>({ value: to }, { duration })
      } else {
        offset.value = { value: to }
      }
    },
    [offset, slideWidth],
  )

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearCarouselTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutValue.value = 0
    }
  }, [timeoutValue])

  const handleAutoScroll = () => {
    const autoScroll = () => {
      const offset = scrollValue.value
      const nextIndex = offset + 1
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
      runOnJS(handleAutoScroll)()
    },
    [scrollValue, slideWidth, autoScrollEnabled],
  )

  // This handles the infinite scrolling
  useAnimatedReaction(
    () => scrollValue.value,
    (offset) => {
      const activeIndex = customRound(offset, ROUNDING_PRECISION)
      // if we are at the last index we need to switch to the second one without animation
      // second one because the first one is a clone of the last one
      if (activeIndex === paddedChildrenArray.length - 1) {
        goToPage(1)
      }
      // if we are at the first index we need to switch to the next to last one without animation
      // next to last one because the last one is a clone of the first one
      if (activeIndex < 0.01 && activeIndex > -0.01) {
        goToPage(paddedChildrenArray.length - 2, 0)
      }
    },
    [childrenArray.length, goToPage, paddedChildrenArray.length, slideWidth, scrollValue],
  )

  return (
    <>
      <AutoCarouselAdapter
        offset={offset}
        onScroll={(activeIndex: number) => {
          'worklet'
          scrollValue.value = activeIndex
        }}
      >
        {React.Children.map(paddedChildrenArray, (child, index) => (
          <AutoCarouselSlide
            width={slideWidth}
            key={index}
            index={index}
            total={paddedChildrenArray.length}
          >
            {child}
          </AutoCarouselSlide>
        ))}
      </AutoCarouselAdapter>
    </>
  )
}
