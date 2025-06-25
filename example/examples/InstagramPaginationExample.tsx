import {
  AutoCarousel,
  CarouselContextProvider,
  useAutoCarouselSlideIndex,
} from '@strv/react-native-hero-carousel'
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect } from 'react'
import { BlurView } from 'expo-blur'
import { TimerPagination } from './components/TimerPagination'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const getRandomImageUrl = () => {
  return `https://picsum.photos/${SCREEN_WIDTH}/${SCREEN_HEIGHT}?random=${Math.floor(Math.random() * 1000)}`
}

const images = Array.from({ length: 5 }, getRandomImageUrl)

const Slide = ({
  image,
  title,
  getInterval,
}: {
  image: string
  title: string
  index: number
  getInterval: (index: number) => number
}) => {
  const { index: currentIndex } = useAutoCarouselSlideIndex()
  const interval = getInterval(currentIndex)

  return (
    <View style={styles.slide}>
      <Image key={image} source={{ uri: image }} style={styles.image} contentFit="cover" />
      <LinearGradient colors={['rgba(0,0,0,0.8)', 'transparent']} style={styles.topGradient} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
        <BlurView style={styles.blurView}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Slide change interval: {interval / 1000} s</Text>
        </BlurView>
      </LinearGradient>
    </View>
  )
}

export default function InstagramPaginationExample() {
  // Preload all images when component mounts
  useEffect(() => {
    Image.prefetch(images)
  }, [])

  const getInterval = (index: number) => {
    'worklet'
    return index * 3000
  }

  return (
    <CarouselContextProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <AutoCarousel interval={getInterval}>
            {images.map((image, index) => (
              <Slide
                key={index}
                image={image}
                title={`Slide ${index + 1}`}
                index={index}
                getInterval={getInterval}
              />
            ))}
          </AutoCarousel>
          <TimerPagination total={images.length} hideProgressOnInteraction />
        </View>
      </SafeAreaView>
    </CarouselContextProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '20%',
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '500',
    color: 'white',
    opacity: 0.8,
  },
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
  blurView: {
    position: 'absolute',
    bottom: 20,
    padding: 20,
    margin: 8,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
})
