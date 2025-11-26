import { HeroCarousel, HeroCarouselProps } from '@strv/react-native-hero-carousel'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { Stack } from 'expo-router'
import { Pagination } from '@/examples/components/Pagination'

export function CarouselBase({ children }: { children: HeroCarouselProps['children'] }) {
  return (
    <HeroCarousel.Provider>
      <Stack.Screen options={{ title: 'Animated Carousel' }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <HeroCarousel>{children}</HeroCarousel>
          <Pagination total={children.length} />
        </View>
      </SafeAreaView>
    </HeroCarousel.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
