import React, { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react'
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

// The pan starts only after this much horizontal movement, and gives way to a vertical scroll after
// this much vertical movement, so a parent scroll view keeps its gestures.
const ACTIVE_OFFSET_X = 10
const FAIL_OFFSET_Y = 10

export const AnimatedPagedView = forwardRef<AnimatedPagedScrollViewRef, AnimatedPagedViewProps>(
  (props, ref) => {
    const translateX = useSharedValue(0)
    const context = useSharedValue({ x: 0 })
    const { slideWidth, centerSlide } = useCarouselContext()
    // Starts the row at the carousel's middle, less half a slide. Layout resolves the 50% against the
    // carousel's own width, so the current slide is centred from the first frame.
    const centerStyle = centerSlide ? { left: '50%' as const, marginLeft: -slideWidth / 2 } : null
    const childrenArray = React.Children.toArray(props.children)
    // Worklets must not capture `props`: it holds React elements, which can't be copied to the UI thread.
    const { onScroll, onScrollBeginDrag } = props
    const slideCount = childrenArray.length

    const clampValue = useCallback(
      (value: number) => {
        'worklet'
        return clamp(value, 0, (slideCount - 1) * slideWidth)
      },
      [slideCount, slideWidth],
    )

    // Memoized, because a gesture rebuilt mid-drag (the carousel re-renders while it's dragged)
    // can disturb the drag in progress.
    const gesture = useMemo(
      () =>
        Gesture.Pan()
          .activeOffsetX([-ACTIVE_OFFSET_X, ACTIVE_OFFSET_X])
          .failOffsetY([-FAIL_OFFSET_Y, FAIL_OFFSET_Y])
          .onStart((event) => {
            // The finger has already moved by the time the pan starts. Counting that movement in
            // keeps the row where it is, instead of jumping to catch up with the finger.
            context.value = { x: translateX.value + event.translationX }
            runOnJS(onScrollBeginDrag)()
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
          }),
      [clampValue, context, onScrollBeginDrag, slideWidth, translateX],
    )

    const animatedStyle = useAnimatedStyle(() => {
      const clampedTranslateX = clampValue(translateX.value)
      return {
        transform: [{ translateX: -clampedTranslateX }],
      }
    }, [clampValue])

    useAnimatedReaction(
      () => translateX.value,
      (value) => {
        onScroll?.(value)
      },
      [onScroll],
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
        <Animated.View style={styles.container}>
          <Animated.View style={[styles.contentContainer, centerStyle, animatedStyle]}>
            {props.children}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    )
  },
)

AnimatedPagedView.displayName = 'AnimatedPagedView'
