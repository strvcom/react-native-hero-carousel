import React, { useCallback, useMemo } from 'react'
import { useSharedValue, useAnimatedReaction, SharedValue } from 'react-native-reanimated'

import { customRound } from '../utils/round'
import { ROUNDING_PRECISION } from '../components/HeroCarousel/index.preset'

export const useCore = ({
  children,
  slideWidth,
  goToPageAnimation,
  scrollValue,
}: {
  children: React.ReactNode[]
  slideWidth: number
  goToPageAnimation: (to: number, duration: number) => number
  scrollValue: SharedValue<number>
}) => {
  const offset = useSharedValue({ value: slideWidth })

  const goToPage = useCallback(
    (page: number, duration = 0) => {
      'worklet'
      const to = page * slideWidth
      if (duration) {
        offset.value = { value: goToPageAnimation(to, duration) }
      } else {
        offset.value = { value: to }
      }
    },
    [offset, slideWidth, goToPageAnimation],
  )

  const goToNextPage = useCallback(() => {
    goToPage(offset.value.value + 1)
  }, [goToPage, offset])

  const childrenArray = useMemo(() => React.Children.toArray(children), [children])

  // need to clone first and last element to have infinite scrolling both ways
  // if it gets to the end we switch back to the start without animation and vice versa
  const paddedChildrenArray = useMemo(
    () => [childrenArray[childrenArray.length - 1], ...childrenArray, childrenArray[0]],
    [childrenArray],
  )
  // This handles the infinite scrolling
  useAnimatedReaction(
    () => scrollValue.value,
    (offset) => {
      const activeIndex = customRound(offset, ROUNDING_PRECISION)
      // if we are at the last index we need to switch to the second one without animation
      // second one because the first one is a clone of the last one
      if (activeIndex >= paddedChildrenArray.length - 1) {
        goToPage(1)
      }
      // if we are at the first index we need to switch to the next to last one without animation
      // next to last one because the last one is a clone of the first one
      if (activeIndex <= 0.01) {
        goToPage(paddedChildrenArray.length - 2, 0)
      }
    },
    [childrenArray.length, goToPage, paddedChildrenArray.length, slideWidth, scrollValue],
  )

  return useMemo(
    () => ({
      goToPage,
      goToNextPage,
      paddedChildrenArray,
      offset,
    }),
    [goToPage, goToNextPage, paddedChildrenArray, offset],
  )
}
