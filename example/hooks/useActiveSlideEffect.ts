import {
  interpolateInsideCarousel,
  useAutoCarouselSlideIndex,
  useCarouselContext,
} from '@strv/react-native-hero-carousel'
import { useState } from 'react'
import { runOnJS, useAnimatedReaction, useDerivedValue } from 'react-native-reanimated'

export const useIsActiveSlide = () => {
  const { index, total } = useAutoCarouselSlideIndex()
  const { scrollValue } = useCarouselContext()
  const [isActive, setIsActive] = useState(false)
  useAnimatedReaction(
    () => scrollValue.value,
    (value) => {
      const result = interpolateInsideCarousel(value, index, total, {
        valueBefore: 0,
        thisValue: 1,
        valueAfter: 0,
      })
      if (result === 1) {
        runOnJS(setIsActive)(true)
      } else {
        runOnJS(setIsActive)(false)
      }
    },
    [index, total],
  )
  return isActive
}

export const useActiveSlideEffect = (
  effectFunc: () => () => void | undefined,
  deps: any[] = [],
) => {
  const { index, total } = useAutoCarouselSlideIndex()
  const { scrollValue } = useCarouselContext()
  const value = useDerivedValue(() => {
    return interpolateInsideCarousel(scrollValue.value, index, total, {
      valueBefore: 0,
      thisValue: 1,
      valueAfter: 0,
    })
  })

  useAnimatedReaction(
    () => value.value,
    (value) => {
      if (value === 1) {
        runOnJS(effectFunc)()
      }
    },
    deps,
  )
}
