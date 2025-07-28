import React from 'react'

import { DEFAULT_INTERVAL } from './index.preset'
import { useCarouselContext } from '../../context/CarouselContext'
import { HeroCarouselSlide } from '../HeroCarouselSlide'
import { HeroCarouselAdapter } from '../AnimatedPagedView/Adapter'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { DEFAULT_ANIMATION } from '../../hooks/useManualScroll'

export type HeroCarouselProps = {
  interval?: number | ((index: number) => number)
  children: React.ReactNode[]
  autoScrollAnimation?: (to: number, duration: number) => number
  disableAutoScroll?: boolean
}

export const HeroCarousel = ({
  interval = DEFAULT_INTERVAL,
  children,
  disableAutoScroll = false,
  autoScrollAnimation = DEFAULT_ANIMATION,
}: HeroCarouselProps) => {
  const {
    scrollValue,
    userInteracted,
    slideWidth,
    timeoutValue,
    goToPage,
    manualScrollValue,
    disableInfiniteScroll,
  } = useCarouselContext()
  const { paddedChildrenArray } = useInfiniteScroll({
    children,
    slideWidth,
    goToPage,
    scrollValue,
    disabled: disableInfiniteScroll,
  })

  const autoScrollEnabled = !userInteracted

  const { runAutoScroll } = useAutoScroll({
    scrollValue,
    slideWidth,
    autoScrollEnabled,
    disableAutoScroll,
    interval,
    goToPage: (page: number, duration?: number) => {
      goToPage(page, duration, autoScrollAnimation)
    },
    timeoutValue,
    totalLength: paddedChildrenArray.length,
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
