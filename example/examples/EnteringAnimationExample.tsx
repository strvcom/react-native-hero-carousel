import {
  AutoCarousel,
  CarouselContextProvider,
  SlideAnimatedView,
} from '@strv/react-native-hero-carousel'
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { FadeIn, SlideInDown, SlideInRight, ZoomIn, FlipInEasyX } from 'react-native-reanimated'

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
      <Image key={image} source={{ uri: image }} style={styles.image} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
        <SlideAnimatedView {...animationConfig}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            Animation: {animationNames[index % animationNames.length]}
          </Text>
        </SlideAnimatedView>
      </LinearGradient>
    </View>
  )
}

export default function EnteringAnimationExample() {
  return (
    <CarouselContextProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <AutoCarousel>
            {images.map((image, index) => (
              <Slide key={index} image={image} title={`Slide ${index + 1}`} index={index} />
            ))}
          </AutoCarousel>
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
    backgroundColor: 'black',
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
  subtitle: {
    fontSize: 16,
    bottom: 70,
    left: 20,
    position: 'absolute',
    lineHeight: 16,
    fontWeight: '500',
    color: 'white',
    opacity: 0.8,
  },
})
