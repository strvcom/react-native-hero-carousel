import { useCarouselContext } from '@strv/react-native-hero-carousel'
import { StyleSheet, View } from 'react-native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { BlurView } from 'expo-blur'

// Individual pagination dot component
const PaginationDot = ({
  index,
  hideProgressOnInteraction,
}: {
  index: number
  total: number
  hideProgressOnInteraction: boolean
}) => {
  const { scrollValue, timeoutValue, userInteracted } = useCarouselContext()

  const progressStyle = useAnimatedStyle(() => {
    const isActive = scrollValue.value - 1 >= index && scrollValue.value - 1 < index + 1
    const wasActive = scrollValue.value - 1 > index

    if ((!isActive && !wasActive) || (hideProgressOnInteraction && userInteracted)) {
      return {
        width: 0,
      }
    }
    return {
      width: `${wasActive ? 100 : timeoutValue.value * 100}%`,
    }
  })

  const dotStyle = useAnimatedStyle(() => {
    const isActive = Math.round(scrollValue.value - 1) === index
    const opacity = isActive ? withTiming(1) : withTiming(0.5)
    return {
      opacity,
    }
  })

  return (
    <View style={styles.paginationDot}>
      <Animated.View style={[styles.dotBackground, dotStyle]} />
      <Animated.View style={[styles.dotProgress, progressStyle]} />
    </View>
  )
}

export const TimerPagination = ({
  total,
  hideProgressOnInteraction,
}: {
  total: number
  hideProgressOnInteraction: boolean
}) => {
  return (
    <BlurView style={styles.paginationContainer}>
      {Array.from({ length: total }).map((_, index) => (
        <PaginationDot
          key={index}
          index={index}
          total={total}
          hideProgressOnInteraction={hideProgressOnInteraction}
        />
      ))}
    </BlurView>
  )
}

const styles = StyleSheet.create({
  paginationContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    zIndex: 10,
  },
  paginationDot: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  dotBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderRadius: 2,
  },
})
