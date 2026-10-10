import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import { Dimensions, type LayoutChangeEvent } from 'react-native'
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
    const { slideWidth, centerSlide } = useCarouselContext()
    // The window's width is the best guess until the carousel has been measured.
    const [containerWidth, setContainerWidth] = useState(() => Dimensions.get('window').width)
    // Centring shifts the whole row, so the neighbours peek in on both sides of the current slide.
    const centerOffset = centerSlide ? Math.max(0, (containerWidth - slideWidth) / 2) : 0
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

    const gesture = Gesture.Pan()
      .minDistance(MIN_DISTANCE_THRESHOLD)
      .onStart(() => {
        context.value = { x: translateX.value }
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
      })

    const animatedStyle = useAnimatedStyle(() => {
      const clampedTranslateX = clampValue(translateX.value)
      return {
        transform: [{ translateX: centerOffset - clampedTranslateX }],
      }
    }, [clampValue, centerOffset])

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
        <Animated.View
          style={styles.container}
          onLayout={(event: LayoutChangeEvent) => setContainerWidth(event.nativeEvent.layout.width)}
        >
          <Animated.View style={[styles.contentContainer, animatedStyle]}>
            {props.children}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    )
  },
)

AnimatedPagedView.displayName = 'AnimatedPagedView'
