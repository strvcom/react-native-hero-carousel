import React from 'react'
import { withTiming } from 'react-native-reanimated'

import { DEFAULT_INTERVAL } from './index.preset'
import { useCarouselContext } from '../../context/CarouselContext'
import { AutoCarouselSlide } from '../AutoCarouselSlide'
import { AutoCarouselAdapter } from '../AnimatedPagedView/Adapter'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import { useCore } from '../../hooks/useCore'

export type AutoCarouselProps = {
  interval?: number | ((index: number) => number)
  children: React.ReactNode[]
  goToPageAnimation?: (to: number, duration: number) => number
  disableAutoScroll?: boolean
}

export const AutoCarousel = ({
  interval = DEFAULT_INTERVAL,
  children,
  goToPageAnimation = (to, duration) => withTiming(to, { duration }),
  disableAutoScroll = false,
}: AutoCarouselProps) => {
  const { scrollValue, userInteracted, slideWidth } = useCarouselContext()

  const { goToPage, paddedChildrenArray, offset } = useCore({
    children,
    slideWidth,
    goToPageAnimation,
    scrollValue,
  })

  const autoScrollEnabled = !userInteracted

  const { timeoutValue } = useAutoScroll({
    scrollValue,
    slideWidth,
    autoScrollEnabled,
    disableAutoScroll,
    interval,
    goToPage,
  })

  return (
    <>
      <AutoCarouselAdapter
        offset={offset}
        onScroll={(activeIndex: number) => {
          'worklet'
          scrollValue.value = activeIndex
        }}
      >
        {React.Children.map(paddedChildrenArray, (child, index) => (
          <AutoCarouselSlide
            width={slideWidth}
            key={index}
            index={index}
            total={paddedChildrenArray.length}
          >
            {child}
          </AutoCarouselSlide>
        ))}
      </AutoCarouselAdapter>
    </>
  )
}
