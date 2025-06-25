import { View } from 'react-native'
import { AutoCarouselSlideContext } from '../../context/SlideContext'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import { useCore } from '../../hooks/useCore'
import { useMemo } from 'react'

export const AutoCarouselSlide = ({
  children,
  width,
  index,
  total,
  runAutoScroll,
  goToPage,
}: {
  children: React.ReactNode
  width: number
  index: number
  total: number
  runAutoScroll: ReturnType<typeof useAutoScroll>['runAutoScroll']
  goToPage: ReturnType<typeof useCore>['goToPage']
}) => {
  return (
    <View style={{ flex: 1, width, minWidth: width }}>
      <AutoCarouselSlideContext.Provider
        value={useMemo(
          () => ({ index, total, runAutoScroll, goToPage }),
          [index, total, runAutoScroll, goToPage],
        )}
      >
        {children}
      </AutoCarouselSlideContext.Provider>
    </View>
  )
}
