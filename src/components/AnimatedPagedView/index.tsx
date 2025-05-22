import { forwardRef, useImperativeHandle, type ForwardedRef } from 'react'
import { Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  runOnJS,
  withTiming,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

import { styles } from './styles'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export type AnimatedPagedScrollViewRef = {
  scrollTo: (value: number) => void
}

export const AnimatedPagedView = forwardRef(
  (
    props: {
      onScroll: (value: number) => void
      onScrollBeginDrag: () => void
      children: React.ReactNode
    },
    ref: ForwardedRef<AnimatedPagedScrollViewRef>,
  ) => {
    const translateX = useSharedValue(0)
    const context = useSharedValue({ x: 0 })

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { x: translateX.value }
        runOnJS(props.onScrollBeginDrag)()
      })
      .onUpdate((event) => {
        translateX.value = context.value.x - event.translationX
      })
      .onEnd((event) => {
        const velocity = event.velocityX
        const currentPage = Math.round(translateX.value / SCREEN_WIDTH)
        const targetPage =
          velocity > 500 ? currentPage - 1 : velocity < -500 ? currentPage + 1 : currentPage
        // in case the gesture overshoots, snap to the nearest page
        if (Math.abs(context.value.x - translateX.value) > SCREEN_WIDTH / 2) {
          translateX.value = withTiming(currentPage * SCREEN_WIDTH)
        } else {
          translateX.value = withTiming(targetPage * SCREEN_WIDTH)
        }
      })

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: -translateX.value }],
      }
    }, [])

    useAnimatedReaction(
      () => translateX.value,
      (value) => {
        props.onScroll?.(value)
      },
    )

    useImperativeHandle(ref, () => ({
      scrollTo: (value: number) => {
        'worklet'
        translateX.value = value
      },
    }))

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
