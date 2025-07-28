import React from 'react'

import { useCarouselContext } from '../../context/CarouselContext'
import { HeroCarouselSlide } from '../HeroCarouselSlide'
import { HeroCarouselAdapter } from '../AnimatedPagedView/Adapter'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { DEFAULT_INTERVAL } from './index.preset'

export type HeroCarouselProps = {
  children: React.ReactNode[]
}

export const HeroCarousel = ({ children }: HeroCarouselProps) => {
  const {
    scrollValue,
    userInteracted,
    slideWidth,
    timeoutValue,
    goToPage,
    manualScrollValue,
    disableInfiniteScroll,
    interval,
    disableAutoScroll,
    autoScrollAnimation,
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
    disableAutoScroll: disableAutoScroll ?? false,
    interval: interval ?? DEFAULT_INTERVAL,
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
