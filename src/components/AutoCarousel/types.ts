import { SharedValue } from 'react-native-reanimated'

export type AutoCarouselAdapterProps = {
  offset: SharedValue<{ value: number }>
  onScroll: (value: number) => void
  children: React.ReactNode
}
