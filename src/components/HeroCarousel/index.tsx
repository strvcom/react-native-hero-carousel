import React from 'react'
import { withTiming } from 'react-native-reanimated'

import { DEFAULT_INTERVAL } from './index.preset'
import { useCarouselContext } from '../../context/CarouselContext'
import { HeroCarouselSlide } from '../HeroCarouselSlide'
import { HeroCarouselAdapter } from '../AnimatedPagedView/Adapter'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import { useCore } from '../../hooks/useCore'

export type HeroCarouselProps = {
  interval?: number | ((index: number) => number)
  children: React.ReactNode[]
  goToPageAnimation?: (to: number, duration: number) => number
  disableAutoScroll?: boolean
}

export const HeroCarousel = ({
  interval = DEFAULT_INTERVAL,
  children,
  goToPageAnimation = (to, duration) => withTiming(to, { duration }),
  disableAutoScroll = false,
}: HeroCarouselProps) => {
  const { scrollValue, userInteracted, slideWidth, timeoutValue } = useCarouselContext()

  const { goToPage, paddedChildrenArray, offset } = useCore({
    children,
    slideWidth,
    goToPageAnimation,
    scrollValue,
  })

  const autoScrollEnabled = !userInteracted

  const { runAutoScroll } = useAutoScroll({
    scrollValue,
    slideWidth,
    autoScrollEnabled,
    disableAutoScroll,
    interval,
    goToPage,
    timeoutValue,
  })

  return (
    <>
      <HeroCarouselAdapter
        offset={offset}
        onScroll={(activeIndex: number) => {
          'worklet'
          scrollValue.value = activeIndex
        }}
      >
        {React.Children.map(paddedChildrenArray, (child, index) => (
          <HeroCarouselSlide
            width={slideWidth}
            key={index}
            index={index}
            total={paddedChildrenArray.length}
            runAutoScroll={runAutoScroll}
            goToPage={goToPage}
          >
            {child}
          </HeroCarouselSlide>
        ))}
      </HeroCarouselAdapter>
    </>
  )
}
