import {
  HeroCarousel,
  CarouselContextProvider,
  SlideAnimatedView,
} from '@strv/react-native-hero-carousel'
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { FadeIn, SlideInDown, SlideInRight, ZoomIn, FlipInEasyX } from 'react-native-reanimated'
import { useEffect } from 'react'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const getRandomImageUrl = () => {
  return `https://picsum.photos/${SCREEN_WIDTH}/${SCREEN_HEIGHT}?random=${Math.floor(Math.random() * 1000)}`
}

const images = Array.from({ length: 5 }, getRandomImageUrl)

const animationNames = ['FadeIn', 'SlideInDown', 'SlideInRight', 'ZoomIn', 'FlipInEasyX']

const Slide = ({ image, title, index }: { image: string; title: string; index: number }) => {
  // Different animation types for each slide to showcase variety
  const animationConfigs = [
    { entering: FadeIn.duration(400) },
    { entering: SlideInDown.duration(500) },
    { entering: SlideInRight.duration(600) },
    { entering: ZoomIn.duration(700) },
    { entering: FlipInEasyX.duration(800) },
  ]

  const animationConfig = animationConfigs[index % animationConfigs.length]

  return (
    <View key={index} style={styles.slide}>
      <Image source={{ uri: image }} style={styles.image} contentFit="cover" transition={200} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
        <View style={styles.text}>
          <SlideAnimatedView style={styles.textContainer} {...animationConfig}>
            <Text style={styles.title}>{title}</Text>
          </SlideAnimatedView>
          <SlideAnimatedView
            style={styles.textContainer}
            entering={FadeIn.duration(400).delay(200)}
          >
            <Text style={styles.subtitle}>
              Animation: {animationNames[index % animationNames.length]}
            </Text>
          </SlideAnimatedView>
        </View>
      </LinearGradient>
    </View>
  )
}

export default function EnteringAnimationExample() {
  // Preload all images when component mounts
  useEffect(() => {
    Image.prefetch(images)
  }, [])

  return (
    <CarouselContextProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <HeroCarousel>
            {images.map((image, index) => (
              <Slide key={index} image={image} title={`Slide ${index + 1}`} index={index} />
            ))}
          </HeroCarousel>
        </View>
      </SafeAreaView>
    </CarouselContextProvider>
  )
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  image: {
    width: '100%',
    height: '100%',
    transformOrigin: 'center',
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
  text: {
    flex: 1,
    bottom: 100,
    left: 20,
    position: 'absolute',
    gap: 16,
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
  },
})
