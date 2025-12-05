import { useInterpolateInsideCarousel } from './useInterpolateInsideCarousel'
import { useState } from 'react'
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated'

export const useIsActiveItem = () => {
  const progress = useInterpolateInsideCarousel({
    valueBefore: 0,
    thisValue: 1,
    valueAfter: 0,
  })
  const [isActive, setIsActive] = useState(false)
  useAnimatedReaction(
    () => progress.value,
    (value) => {
      if (value === 1) {
        runOnJS(setIsActive)(true)
      } else {
        runOnJS(setIsActive)(false)
      }
    },
    [],
  )
  return isActive
}

export const useActiveItemEffect = (effectFunc: () => void | undefined, deps: any[] = []) => {
  const progress = useInterpolateInsideCarousel({
    valueBefore: 0,
    thisValue: 1,
    valueAfter: 0,
  })

  useAnimatedReaction(
    () => progress.value,
    (value) => {
      if (value === 1) {
        runOnJS(effectFunc)()
      }
    },
    deps,
  )
}
