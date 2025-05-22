import { useAnimatedReaction } from 'react-native-reanimated'
import { useRef } from 'react'
import { AnimatedPagedScrollViewRef, AnimatedPagedView } from './index'
import { customRound } from '../../utils/round'
import { ROUNDING_PRECISION } from '../../components/AutoCarousel/index.preset'
import { useCarouselContext } from '../../context/CarouselContext'
import { AutoCarouselAdapterProps } from '../../components/AutoCarousel/types'

export const AutoCarouselAdapter = ({ offset, onScroll, children }: AutoCarouselAdapterProps) => {
  const scrollViewRef = useRef<AnimatedPagedScrollViewRef | null>(null)
  const { slideWidth, setUserInteracted } = useCarouselContext()

  useAnimatedReaction(
    () => offset.value.value,
    (value) => {
      scrollViewRef.current?.scrollTo(value)
    },
  )

  const handleScroll = (value: number) => {
    'worklet'
    const activeIndex = customRound(value / slideWidth, ROUNDING_PRECISION)
    if (value === 0) return
    onScroll(activeIndex)
  }

  return (
    <AnimatedPagedView
      ref={scrollViewRef}
      onScrollBeginDrag={() => {
        setUserInteracted(true)
      }}
      onScroll={handleScroll}
    >
      {children}
    </AnimatedPagedView>
  )
}
