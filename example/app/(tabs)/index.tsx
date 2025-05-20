import { ThemedView } from '@/components/ThemedView'
import { Carousel } from '@strv/react-native-hero-carousel'
import { SafeAreaView } from 'react-native'
export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <Carousel />
      </ThemedView>
    </SafeAreaView>
  )
}
