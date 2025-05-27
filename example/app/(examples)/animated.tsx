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

const Slide = ({ image, title, index }: { image: string; title: string; index: number }) => {
  const { scrollValue } = useCarouselContext()
  const { index: slideIndex, total } = useAutoCarouselSlideIndex()

  const rStyle = useAnimatedStyle(() => {
    const progress = interpolateLooped(scrollValue.value, slideIndex, total, {
      incoming: 0,
      inside: 1,
      outgoing: 0,
      offset: 0.2,
    })

    return {
      flex: 1,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      transformOrigin: 'center',
      transform: [
        {
          scale: interpolate(progress, [0, 1], [0.8, 1], Extrapolation.CLAMP),
        },
        {
          rotate: `${interpolate(progress, [0, 1], [-15, 0], Extrapolation.CLAMP)}deg`,
        },
      ],
      opacity: progress,
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

export default function AnimatedExample() {
  return (
    <CarouselContextProvider>
      <Stack.Screen options={{ title: 'Animated Carousel' }} />
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.container}>
          <AutoCarouselWithoutProvider>
            {images.map((image, index) => (
              <Slide key={index} image={image} title={`Slide ${index + 1}`} index={index} />
            ))}
          </AutoCarouselWithoutProvider>
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
})
