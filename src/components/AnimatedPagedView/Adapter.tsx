import { useAnimatedReaction } from 'react-native-reanimated'
import { useCallback, useRef } from 'react'
import { AnimatedPagedScrollViewRef, AnimatedPagedView } from './index'
import { customRound } from '../../utils/round'
import { ROUNDING_PRECISION } from '../HeroCarousel/index.preset'
import { useCarouselContext } from '../../context/CarouselContext'
import { HeroCarouselAdapterProps } from '../HeroCarousel/types'

export const HeroCarouselAdapter = ({
  manualScrollValue,
  onScroll,
  children,
}: HeroCarouselAdapterProps) => {
  const scrollViewRef = useRef<AnimatedPagedScrollViewRef>(null)
  const { slideWidth = 0, setUserInteracted } = useCarouselContext()

  useAnimatedReaction(
    () => manualScrollValue.value.value,
    (value) => {
      scrollViewRef.current?.scrollTo(value)
    },
    [],
  )

  // Stable, so the pager's memoized gesture isn't rebuilt on every render.
  const handleScrollBeginDrag = useCallback(() => setUserInteracted(true), [setUserInteracted])

  const handleScroll = (value: number) => {
    'worklet'
    const activeIndex = customRound(value / slideWidth, ROUNDING_PRECISION)
    if (value === 0) return
    onScroll(activeIndex)
  }

  return (
    <AnimatedPagedView
      ref={scrollViewRef}
      onScrollBeginDrag={handleScrollBeginDrag}
      onScroll={handleScroll}
    >
      {children}
    </AnimatedPagedView>
  )
}
