import React, { useRef, useEffect, useCallback } from 'react'
import { Platform } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
  useAnimatedReaction,
  scrollTo,
  useAnimatedRef,
} from 'react-native-reanimated'

import {
  ANDROID_FALLBACK_DURATION,
  DEFAULT_INTERVAL,
  ROUNDING_PRECISION,
  TRANSITION_DURATION,
} from './index.preset'
import { CarouselContextProvider, useCarouselContext } from '../../context/CarouselContext'
import { AnimatedPagedScrollView } from '../AnimatedPagedScrollView'
import { AutoCarouselSlide } from '../AutoCarouselSlide'
import { customRound } from '../../utils/round'

type AutoCarouselProps = {
  interval?: number
  children: JSX.Element | JSX.Element[]
}

export const AutoCarouselWithoutProvider = ({
  interval = DEFAULT_INTERVAL,
  children,
}: AutoCarouselProps) => {
  const { scrollValue, userInteracted, setUserInteracted, slideWidth } = useCarouselContext()
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>()
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

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleAutoScroll = () => {
    const autoScroll = () => {
      const offset = scrollValue.value
      const nextIndex = offset + 1
      goToPage(nextIndex, TRANSITION_DURATION)
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(autoScroll, interval)
  }

  useEffect(() => {
    if (!autoScrollEnabled && timeoutRef.current) clearTimeout(timeoutRef.current)
    return () => {
      if (!timeoutRef.current) return
      clearTimeout(timeoutRef.current)
    }
  }, [autoScrollEnabled])

  useAnimatedReaction(
    () => scrollValue.value,
    (offset) => {
      if (slideWidth === 0) return
      if (offset % 1 !== 0) return
      if (!autoScrollEnabled) return
      runOnJS(handleAutoScroll)()
    },
    [scrollValue.value, slideWidth, autoScrollEnabled],
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
      if (activeIndex === 0) {
        // weird issue when scrolling backwards on android we must set duration to a very small value
        // otherwise with just 0 the list doesn't scroll
        goToPage(
          paddedChildrenArray.length - 2,
          Platform.OS === 'android' ? ANDROID_FALLBACK_DURATION : 0,
        )
      }
    },
    [childrenArray.length, goToPage, paddedChildrenArray.length, slideWidth, scrollValue.value],
  )

  const scrollHandler = useAnimatedScrollHandler(
    (event) => {
      const activeIndex = customRound(event.contentOffset.x / slideWidth, ROUNDING_PRECISION)
      if (event.contentOffset.x === 0) return
      scrollValue.value = activeIndex
    },
    [slideWidth, autoScrollEnabled],
  )

  useAnimatedReaction(
    () => offset.value.value,
    (value) => {
      scrollTo(scrollViewRef, value, 0, false)
    },
  )

  return (
    <AnimatedPagedScrollView
      ref={scrollViewRef}
      onScrollBeginDrag={() => {
        setUserInteracted(true)
      }}
      onScroll={scrollHandler}
    >
      {React.Children.map(paddedChildrenArray, (child, index) => (
        <AutoCarouselSlide width={slideWidth} key={index}>
          {child}
        </AutoCarouselSlide>
      ))}
    </AnimatedPagedScrollView>
  )
}

export const AutoCarousel = ({ interval, children }: AutoCarouselProps) => {
  return (
    <CarouselContextProvider>
      <AutoCarouselWithoutProvider interval={interval}>{children}</AutoCarouselWithoutProvider>
    </CarouselContextProvider>
  )
}
