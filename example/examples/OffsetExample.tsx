import {
  AutoCarousel,
  CarouselContextProvider,
  interpolateInsideCarousel,
  useAutoCarouselSlideIndex,
  useCarouselContext,
} from '@strv/react-native-hero-carousel'
import { SafeAreaView, StyleSheet, View, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const getRandomImageUrl = () => {
  return `https://picsum.photos/${SCREEN_WIDTH}/${SCREEN_HEIGHT}?random=${Math.floor(Math.random() * 1000)}`
}

const images = Array.from({ length: 5 }, getRandomImageUrl)

const animationFunction = (
  scrollValue: number,
  slideIndex: number,
  total: number,
  offset: number,
) => {
  'worklet'
  return {
    opacity: interpolateInsideCarousel(scrollValue, slideIndex, total, {
      slideBefore: 1,
      thisSlide: 1,
      slideAfter: 0,
      offset,
    }),
    transform: [
      {
        translateX: interpolateInsideCarousel(scrollValue, slideIndex, total, {
          slideBefore: 0,
          thisSlide: 0,
          slideAfter: 100,
          offset,
        }),
      },
    ],
  }
}

const Slide = ({
  image,
  title,
  subtitle,
  index,
}: {
  image: string
  title: string
  subtitle: string
  index: number
}) => {
  const { scrollValue } = useCarouselContext()
  const { index: slideIndex, total } = useAutoCarouselSlideIndex()

  const rTitleStyle = useAnimatedStyle(() => {
    return animationFunction(scrollValue.value, slideIndex, total, 0.5)
  })

  const rSubtitleStyle = useAnimatedStyle(() => {
    return animationFunction(scrollValue.value, slideIndex, total, 0.7)
  })

  const rIconStyle = useAnimatedStyle(() => {
    return animationFunction(scrollValue.value, slideIndex, total, 0.4)
  })

  const rSecondIconStyle = useAnimatedStyle(() => {
    return animationFunction(scrollValue.value, slideIndex, total, 0.6)
  })

  const rThirdIconStyle = useAnimatedStyle(() => {
    return animationFunction(scrollValue.value, slideIndex, total, 0.8)
  })

  return (
    <View key={index} style={styles.slide}>
      <Image key={image} source={{ uri: image }} style={styles.image} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
        <View style={styles.contentContainer}>
          <Animated.Text style={[styles.title, rTitleStyle]}>{title}</Animated.Text>
          <Animated.Text style={[styles.subtitle, rSubtitleStyle]}>{subtitle}</Animated.Text>
          <View style={styles.iconContainer}>
            <Animated.Text style={[styles.icon, rIconStyle]}>🚀</Animated.Text>
            <Animated.Text style={[styles.icon, rSecondIconStyle]}>🧨</Animated.Text>
            <Animated.Text style={[styles.icon, rThirdIconStyle]}>🎉</Animated.Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}

export default function OffsetExample() {
  return (
    <CarouselContextProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <AutoCarousel>
            {images.map((image, index) => (
              <Slide
                key={index}
                image={image}
                title={`Slide ${index + 1}`}
                subtitle={`Subtitle ${index + 1}`}
                index={index}
              />
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
  contentContainer: {
    bottom: 100,
    left: 20,
    position: 'absolute',
    gap: 10,
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 24,
    lineHeight: 24,
    color: 'white',
  },
  icon: {
    fontSize: 48,
    lineHeight: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 10,
  },
  iconContainer: {
    gap: 10,
    flexDirection: 'row',
  },
})
