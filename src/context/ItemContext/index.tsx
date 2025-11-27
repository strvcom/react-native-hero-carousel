import { createContext, useContext } from 'react'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import { useManualScroll } from '../../hooks/useManualScroll'

export const ItemContext = createContext<{
  index: number
  total: number
  runAutoScroll: ReturnType<typeof useAutoScroll>['runAutoScroll']
  goToPage: ReturnType<typeof useManualScroll>['goToPage']
} | null>(null)

export const useAutoCarouselSlideIndex = () => {
  const context = useContext(ItemContext)
  if (!context) {
    throw new Error('useAutoCarouselSlideIndex must be used within a AutoCarouselSlide')
  }
  return context
}
