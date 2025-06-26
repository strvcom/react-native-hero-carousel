import { useAutoCarouselSlideIndex, useCarouselContext } from '../../context'
import Animated, {
  useDerivedValue,
  useAnimatedReaction,
  runOnJS,
  AnimatedProps,
} from 'react-native-reanimated'
import { interpolateInsideCarousel } from '../../utils'
import { useState } from 'react'
import { ViewProps } from 'react-native'

type SlideAnimatedViewProps = {
  children: React.ReactNode
  entering?: AnimatedProps<ViewProps>['entering']
  exiting?: AnimatedProps<ViewProps>['exiting']
  layout?: AnimatedProps<ViewProps>['layout']
  enteringThreshold?: number
  exitingThreshold?: number
  style?: AnimatedProps<ViewProps>['style']
}

export const SlideAnimatedView = ({
  children,
  entering,
  exiting,
  layout,
  enteringThreshold = 0.99,
  exitingThreshold = 0.01,
  style,
}: SlideAnimatedViewProps) => {
  const { index, total } = useAutoCarouselSlideIndex()
  const { scrollValue } = useCarouselContext()
  const [shouldShow, setShouldShow] = useState(false)

  const value = useDerivedValue(() => {
    return interpolateInsideCarousel(scrollValue.value, index, total, {
      valueBefore: 0,
      thisValue: 1,
      valueAfter: 0,
    })
  }, [index, total, scrollValue])

  // Track when value becomes 1 to trigger entering animation
  useAnimatedReaction(
    () => value.value,
    (currentValue, previousValue) => {
      // Trigger entering animation when value becomes 1
      if (
        currentValue >= enteringThreshold &&
        (previousValue === null || previousValue < enteringThreshold)
      ) {
        runOnJS(setShouldShow)(true)
      }
      // Trigger exiting animation when value goes back to 0
      if (
        currentValue <= exitingThreshold &&
        (previousValue === null || previousValue > exitingThreshold)
      ) {
        runOnJS(setShouldShow)(false)
      }
    },
    [enteringThreshold, exitingThreshold],
  )

  if (!shouldShow) {
    return null
  }

  return (
    <Animated.View entering={entering} exiting={exiting} layout={layout} style={style}>
      {children}
    </Animated.View>
  )
}
