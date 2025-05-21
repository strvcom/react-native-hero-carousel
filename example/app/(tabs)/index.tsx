import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { AutoCarousel } from '@strv/react-native-hero-carousel'
import { SafeAreaView } from 'react-native'
export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <AutoCarousel>
          <ThemedView
            style={{
              flex: 1,
              backgroundColor: 'red',
              maxHeight: 200,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ThemedText type="title">Slide 1</ThemedText>
          </ThemedView>
          <ThemedView
            style={{
              flex: 1,
              backgroundColor: 'blue',
              maxHeight: 200,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ThemedText type="title">Slide 2</ThemedText>
          </ThemedView>
          <ThemedView
            style={{
              flex: 1,
              backgroundColor: 'green',
              maxHeight: 200,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ThemedText type="title">Slide 3</ThemedText>
          </ThemedView>
        </AutoCarousel>
      </ThemedView>
    </SafeAreaView>
  )
}
