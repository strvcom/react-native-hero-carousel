import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { AutoCarousel } from '@strv/react-native-hero-carousel'
import { SafeAreaView, StyleSheet, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const getRandomImageUrl = () => {
  return `https://picsum.photos/${SCREEN_WIDTH}/${SCREEN_HEIGHT}?random=${Math.floor(Math.random() * 1000)}`
}

const images = Array.from({ length: 5 }, getRandomImageUrl)

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.container}>
        <AutoCarousel>
          {images.map((image, index) => (
            <ThemedView key={index} style={styles.slide}>
              <Image source={{ uri: image }} style={styles.image} contentFit="cover" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
                <ThemedText style={styles.title}>Slide {index + 1}</ThemedText>
              </LinearGradient>
            </ThemedView>
          ))}
        </AutoCarousel>
      </ThemedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
  },
  image: {
    width: '100%',
    height: '100%',
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
