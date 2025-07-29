import { HeroCarousel, CarouselContextProvider } from '@strv/react-native-hero-carousel'
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect } from 'react'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const getRandomImageUrl = () => {
  return `https://picsum.photos/${SCREEN_WIDTH}/${SCREEN_HEIGHT}?random=${Math.floor(Math.random() * 1000)}`
}

const images = Array.from({ length: 5 }, getRandomImageUrl)

const Slide = ({ image, title, index }: { image: string; title: string; index: number }) => {
  return (
    <View key={index} style={styles.slide}>
      <Image
        key={image}
        source={{ uri: image }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
    </View>
  )
}

export default function BasicExample() {
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
    opacity: 0.5,
  },
})
