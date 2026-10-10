import React, { useState } from 'react'
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated'

import { CarouselContextProvider, useCarouselContext } from '../../context/CarouselContext'
import { HeroCarouselSlide } from '../HeroCarouselSlide'
import { HeroCarouselAdapter } from '../AnimatedPagedView/Adapter'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { DEFAULT_INTERVAL } from './index.preset'
import { ItemAnimatedView } from '../ItemAnimatedView'
import { isInRenderWindow } from '../../utils/isInRenderWindow'

export type HeroCarouselProps = {
  children: React.ReactNode[]
}

const HeroCarousel = ({ children }: HeroCarouselProps) => {
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
    renderWindow,
  } = useCarouselContext()
  const { paddedChildrenArray } = useInfiniteScroll({
    children,
    slideWidth,
    goToPage,
    scrollValue,
    disabled: disableInfiniteScroll,
  })

  // Follows the page React-side only when the rounded page changes, not on every frame.
  const [activeIndex, setActiveIndex] = useState(() => Math.round(scrollValue.value))

  useAnimatedReaction(
    () => Math.round(scrollValue.value),
    (index, previous) => {
      if (index !== previous) runOnJS(setActiveIndex)(index)
    },
  )

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
            {isInRenderWindow({
              index,
              activeIndex,
              slideCount: children.length,
              renderWindow,
              isInfinite: !disableInfiniteScroll,
            })
              ? child
              : // An empty slot of the same width keeps every slide's position.
                null}
          </HeroCarouselSlide>
        ))}
      </HeroCarouselAdapter>
    </>
  )
}

HeroCarousel.AnimatedView = ItemAnimatedView
HeroCarousel.Provider = CarouselContextProvider
HeroCarousel.Item = HeroCarouselSlide

export { HeroCarousel }
