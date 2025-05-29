import {
  AutoCarousel,
  AutoCarouselProps,
  CarouselContextProvider,
} from '@strv/react-native-hero-carousel'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { Stack } from 'expo-router'
import { Pagination } from '@/examples/components/Pagination'

export function CarouselBase({ children }: { children: AutoCarouselProps['children'] }) {
  return (
    <CarouselContextProvider>
      <Stack.Screen options={{ title: 'Animated Carousel' }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <AutoCarousel>{children}</AutoCarousel>
          <Pagination total={children.length} />
        </View>
      </SafeAreaView>
    </CarouselContextProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
