import React from 'react'

import { DEFAULT_INTERVAL } from './index.preset'
import { useCarouselContext } from '../../context/CarouselContext'
import { HeroCarouselSlide } from '../HeroCarouselSlide'
import { HeroCarouselAdapter } from '../AnimatedPagedView/Adapter'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'

export type HeroCarouselProps = {
  interval?: number | ((index: number) => number)
  children: React.ReactNode[]
  goToPageAnimation?: (to: number, duration: number) => number
  disableAutoScroll?: boolean
}

export const HeroCarousel = ({
  interval = DEFAULT_INTERVAL,
  children,
  disableAutoScroll = false,
}: HeroCarouselProps) => {
  const { scrollValue, userInteracted, slideWidth, timeoutValue, goToPage, manualScrollValue } =
    useCarouselContext()
  const { paddedChildrenArray } = useInfiniteScroll({
    children,
    slideWidth,
    goToPage,
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
        manualScrollValue={manualScrollValue}
        onScroll={(activeIndex: number) => {
          'worklet'
          scrollValue.value = activeIndex
        }}
      >
        {React.Children.map(paddedChildrenArray, (child, index) => (
          <HeroCarouselSlide
            width={slideWidth ?? 0}
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
