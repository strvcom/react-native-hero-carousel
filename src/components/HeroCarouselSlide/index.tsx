import { View } from 'react-native'
import { ItemContext } from '../../context/ItemContext'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import { useMemo } from 'react'
import { useManualScroll } from '../../hooks/useManualScroll'

export const HeroCarouselSlide = ({
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
  goToPage: ReturnType<typeof useManualScroll>['goToPage']
}) => {
  return (
    <View style={{ flex: 1, width, minWidth: width }}>
      <ItemContext.Provider
        value={useMemo(
          () => ({ index, total, runAutoScroll, goToPage }),
          [index, total, runAutoScroll, goToPage],
        )}
      >
        {children}
      </ItemContext.Provider>
    </View>
  )
}
