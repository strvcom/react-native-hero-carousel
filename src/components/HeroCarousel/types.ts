import { SharedValue } from 'react-native-reanimated'

export type HeroCarouselAdapterProps = {
  manualScrollValue: SharedValue<{ value: number }>
  onScroll: (value: number) => void
  children: React.ReactNode
}
