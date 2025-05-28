import {
  AutoCarousel,
  interpolateInsideCarousel,
  useCarouselContext,
  useAutoCarouselSlideIndex,
  CarouselContextProvider,
} from '@strv/react-native-hero-carousel'
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated'
import { Pagination } from './components/Pagination'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const getRandomImageUrl = () => {
  return `https://picsum.photos/${SCREEN_WIDTH}/${SCREEN_HEIGHT}?random=${Math.floor(Math.random() * 1000)}`
}

const images = Array.from({ length: 5 }, getRandomImageUrl)

const Slide = ({ image, title, index }: { image: string; title: string; index: number }) => {
  const { scrollValue } = useCarouselContext()
  const { index: slideIndex, total } = useAutoCarouselSlideIndex()

  const rStyle = useAnimatedStyle(() => {
    const progress = interpolateInsideCarousel(scrollValue, slideIndex, total, {
      slideBefore: 0,
      thisSlide: 1,
      slideAfter: 0,
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
    <View key={index} style={styles.slide}>
      <Animated.View style={rStyle}>
        <Image source={{ uri: image }} style={styles.image} contentFit="cover" />
      </Animated.View>
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
    </View>
  )
}

export default function AnimatedExample() {
  return (
    <CarouselContextProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <AutoCarousel>
            {images.map((image, index) => (
              <Slide key={index} image={image} title={`Slide ${index + 1}`} index={index} />
            ))}
          </AutoCarousel>
          <Pagination total={images.length} />
        </View>
      </SafeAreaView>
    </CarouselContextProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
