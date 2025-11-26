import {
  HeroCarousel,
  interpolateInsideCarousel,
  useCarouselContext,
  useAutoCarouselSlideIndex,
} from '@strv/react-native-hero-carousel'
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated'
import { Pagination } from './components/Pagination'
import { useEffect } from 'react'
import { BlurView } from 'expo-blur'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const getRandomImageUrl = () => {
  return `https://picsum.photos/${SCREEN_WIDTH * 3}/${SCREEN_HEIGHT * 3}?random=${Math.floor(
    Math.random() * 1000,
  )}`
}

const images = Array.from({ length: 5 }, getRandomImageUrl)

const Slide = ({ image, title, index }: { image: string; title: string; index: number }) => {
  const { scrollValue } = useCarouselContext()
  const { index: slideIndex, total } = useAutoCarouselSlideIndex()

  const rStyle = useAnimatedStyle(() => {
    const progress = interpolateInsideCarousel(scrollValue.value, slideIndex, total, {
      valueBefore: 0,
      thisValue: 1,
      valueAfter: 0,
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
        <Image source={{ uri: image }} style={styles.image} contentFit="cover" transition={200} />
      </Animated.View>
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
        <BlurView style={styles.blurView} experimentalBlurMethod="dimezisBlurView">
          <Text style={styles.title}>{title}</Text>
        </BlurView>
      </LinearGradient>
    </View>
  )
}

export default function AnimatedExample() {
  // Preload all images when component mounts
  useEffect(() => {
    Image.prefetch(images)
  }, [])

  return (
    <HeroCarousel.Provider>
      <SafeAreaView style={styles.container}>
        <View style={styles.carouselContainer}>
          <HeroCarousel>
            {images.map((image, index) => (
              <Slide key={index} image={image} title={`Slide ${index + 1}`} index={index} />
            ))}
          </HeroCarousel>
        </View>
        <View style={styles.paginationContainer}>
          <Pagination total={images.length} />
        </View>
      </SafeAreaView>
    </HeroCarousel.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  carouselContainer: {
    flex: 0.8,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 64,
  },
  paginationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.2,
  },
  blurView: {
    bottom: 40,
    left: 20,
    position: 'absolute',
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
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
    transform: [{ scale: 1.3 }],
    backgroundColor: 'gray',
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
    lineHeight: 32,
    fontWeight: 'bold',
    color: 'white',
  },
})
