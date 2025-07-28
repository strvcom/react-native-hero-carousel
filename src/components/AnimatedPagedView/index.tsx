import React, { forwardRef, useCallback, useImperativeHandle } from 'react'
import { Dimensions } from 'react-native'
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

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export type AnimatedPagedScrollViewRef = {
  scrollTo: (value: number) => void
}

type AnimatedPagedViewProps = {
  onScroll: (value: number) => void
  onScrollBeginDrag: () => void
  children: React.ReactNode
}

export const AnimatedPagedView = forwardRef<AnimatedPagedScrollViewRef, AnimatedPagedViewProps>(
  (props, ref) => {
    const translateX = useSharedValue(0)
    const context = useSharedValue({ x: 0 })
    const childrenArray = React.Children.toArray(props.children)

    const clampValue = useCallback(
      (value: number) => {
        'worklet'
        return clamp(value, 0, (childrenArray.length - 1) * SCREEN_WIDTH)
      },
      [childrenArray.length],
    )

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { x: translateX.value }
        runOnJS(props.onScrollBeginDrag)()
      })
      .onUpdate((event) => {
        translateX.value = clampValue(context.value.x - event.translationX)
      })
      .onEnd((event) => {
        const velocity = event.velocityX
        const currentPage = Math.round(translateX.value / SCREEN_WIDTH)
        const targetPage =
          velocity > 500 ? currentPage - 1 : velocity < -500 ? currentPage + 1 : currentPage
        // in case the gesture overshoots, snap to the nearest page
        if (Math.abs(context.value.x - translateX.value) > SCREEN_WIDTH / 2) {
          translateX.value = withTiming(clampValue(currentPage * SCREEN_WIDTH))
        } else {
          translateX.value = withTiming(clampValue(targetPage * SCREEN_WIDTH))
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
