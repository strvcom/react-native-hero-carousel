import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import {
  interpolateLooped,
  useCarouselContext,
  useAutoCarouselSlideIndex,
  AutoCarouselWithoutProvider,
  CarouselContextProvider,
} from '@strv/react-native-hero-carousel'
import { SafeAreaView, StyleSheet, Dimensions, View } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated'
import { Stack } from 'expo-router'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const getRandomImageUrl = () => {
  return `https://picsum.photos/${SCREEN_WIDTH}/${SCREEN_HEIGHT}?random=${Math.floor(Math.random() * 1000)}`
}

const images = Array.from({ length: 5 }, getRandomImageUrl)

const PaginationDot = ({ index, currentIndex }: { index: number; currentIndex: number }) => {
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

const Pagination = () => {
  const { scrollValue } = useCarouselContext()

  return (
    <View style={styles.pagination}>
      {Array.from({ length: images.length }).map((_, index) => (
        <PaginationDot key={index} index={index} currentIndex={scrollValue.value} />
      ))}
    </View>
  )
}

const Slide = ({ image, title, index }: { image: string; title: string; index: number }) => {
  const { scrollValue } = useCarouselContext()
  const { index: slideIndex, total } = useAutoCarouselSlideIndex()

  const rStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      transformOrigin: 'center',
      transform: [
        {
          translateX: interpolateLooped(scrollValue.value, slideIndex, total, {
            incoming: 0,
            inside: -100,
            outgoing: 0,
            offset: 0.2,
          }),
        },
        {
          translateY: interpolateLooped(scrollValue.value, slideIndex, total, {
            incoming: 0,
            inside: -10,
            outgoing: 0,
            offset: 0.2,
          }),
        },
      ],
    }
  })

  return (
    <ThemedView key={index} style={styles.slide}>
      <Animated.View style={rStyle}>
        <Image source={{ uri: image }} style={styles.image} contentFit="cover" />
      </Animated.View>
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
        <ThemedText style={styles.title}>{title}</ThemedText>
      </LinearGradient>
    </ThemedView>
  )
}

export default function BasicExample() {
  return (
    <CarouselContextProvider>
      <Stack.Screen options={{ title: 'Basic Carousel' }} />
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.container}>
          <AutoCarouselWithoutProvider>
            {images.map((image, index) => (
              <Slide key={index} image={image} title={`Slide ${index + 1}`} index={index} />
            ))}
          </AutoCarouselWithoutProvider>
          <Pagination />
        </ThemedView>
      </SafeAreaView>
    </CarouselContextProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    transformOrigin: 'center',
    transform: [{ scale: 1.6 }],
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  title: {
    fontSize: 32,
    bottom: 100,
    left: 20,
    position: 'absolute',
    lineHeight: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  pagination: {
    position: 'absolute',
    bottom: 100,
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
