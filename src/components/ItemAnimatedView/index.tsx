import Animated, {
  useDerivedValue,
  useAnimatedReaction,
  runOnJS,
  AnimatedProps,
} from 'react-native-reanimated'
import { useState } from 'react'
import { ViewProps } from 'react-native'
import { useInterpolateInsideCarousel } from '../../hooks/useInterpolateInsideCarousel'

type ItemAnimatedViewProps = {
  children: React.ReactNode
  entering?: AnimatedProps<ViewProps>['entering']
  exiting?: AnimatedProps<ViewProps>['exiting']
  layout?: AnimatedProps<ViewProps>['layout']
  enteringThreshold?: number
  exitingThreshold?: number
  style?: AnimatedProps<ViewProps>['style']
  keepVisibleAfterExiting?: boolean
}

export const ItemAnimatedView = ({
  children,
  entering,
  exiting,
  layout,
  enteringThreshold = 0.99,
  exitingThreshold = 0.01,
  keepVisibleAfterExiting = false,
  style,
}: ItemAnimatedViewProps) => {
  const progress = useInterpolateInsideCarousel({
    valueBefore: 0,
    thisValue: 1,
    valueAfter: 0,
  })
  const [shouldShow, setShouldShow] = useState(false)

  const value = useDerivedValue(() => {
    return progress.value
  }, [progress])

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
        if (keepVisibleAfterExiting) {
          return
        }
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
