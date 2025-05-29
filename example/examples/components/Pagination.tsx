import { useCarouselContext } from '@strv/react-native-hero-carousel'
import { StyleSheet, View } from 'react-native'
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const PaginationDot = ({ index }: { index: number }) => {
  const { scrollValue } = useCarouselContext()

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        scrollValue.value - 1,
        [index - 1, index, index + 1],
        [8, 24, 8],
        Extrapolation.CLAMP,
      ),
      opacity: interpolate(
        scrollValue.value - 1,
        [index - 1, index, index + 1],
        [0.5, 1, 0.5],
        Extrapolation.CLAMP,
      ),
    }
  })

  return <Animated.View style={[styles.dot, animatedStyle]} />
}

export const Pagination = ({ total }: { total: number }) => {
  const { bottom } = useSafeAreaInsets()

  return (
    <View style={[styles.pagination, { bottom }]}>
      {Array.from({ length: total }).map((_, index) => (
        <PaginationDot key={index} index={index} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
})
