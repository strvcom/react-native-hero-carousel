import React, { forwardRef, useCallback, useImperativeHandle } from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  runOnJS,
  withTiming,
  clamp,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

import { styles } from './styles'
import { useCarouselContext } from '../../context/CarouselContext'

export type AnimatedPagedScrollViewRef = {
  scrollTo: (value: number) => void
}

type AnimatedPagedViewProps = {
  onScroll: (value: number) => void
  onScrollBeginDrag: () => void
  children: React.ReactNode
}

// easiest way to allow other gestures to work, for example the scroll view
const MIN_DISTANCE_THRESHOLD = 30

export const AnimatedPagedView = forwardRef<AnimatedPagedScrollViewRef, AnimatedPagedViewProps>(
  (props, ref) => {
    const translateX = useSharedValue(0)
    const context = useSharedValue({ x: 0 })
    const { slideWidth } = useCarouselContext()
    const childrenArray = React.Children.toArray(props.children)

    const clampValue = useCallback(
      (value: number) => {
        'worklet'
        return clamp(value, 0, (childrenArray.length - 1) * slideWidth)
      },
      [childrenArray.length, slideWidth],
    )

    const gesture = Gesture.Pan()
      .minDistance(MIN_DISTANCE_THRESHOLD)
      .onStart(() => {
        context.value = { x: translateX.value }
        runOnJS(props.onScrollBeginDrag)()
      })
      .onUpdate((event) => {
        translateX.value = clampValue(context.value.x - event.translationX)
      })
      .onEnd((event) => {
        const velocity = event.velocityX
        const currentPage = Math.round(translateX.value / slideWidth)
        const targetPage =
          velocity > 500 ? currentPage - 1 : velocity < -500 ? currentPage + 1 : currentPage
        // in case the gesture overshoots, snap to the nearest page
        if (Math.abs(context.value.x - translateX.value) > slideWidth / 2) {
          translateX.value = withTiming(clampValue(currentPage * slideWidth))
        } else {
          translateX.value = withTiming(clampValue(targetPage * slideWidth))
        }
      })

    const animatedStyle = useAnimatedStyle(() => {
      const clampedTranslateX = clampValue(translateX.value)
      return {
        transform: [{ translateX: -clampedTranslateX }],
      }
    }, [])

    useAnimatedReaction(
      () => translateX.value,
      (value) => {
        props.onScroll?.(value)
      },
      [props.onScroll],
    )

    useImperativeHandle(
      ref,
      () => ({
        scrollTo: (value: number) => {
          'worklet'
          translateX.value = value
        },
      }),
      [translateX],
    )

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.container]}>
          <Animated.View style={[styles.contentContainer, animatedStyle]}>
            {props.children}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    )
  },
)

AnimatedPagedView.displayName = 'AnimatedPagedView'
