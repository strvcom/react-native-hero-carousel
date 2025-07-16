import { createContext, useContext } from 'react'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import { useManualScroll } from 'hooks/useManualScroll'

export const AutoCarouselSlideContext = createContext<{
  index: number
  total: number
  runAutoScroll: ReturnType<typeof useAutoScroll>['runAutoScroll']
  goToPage: ReturnType<typeof useManualScroll>['goToPage']
} | null>(null)

export const useAutoCarouselSlideIndex = () => {
  const context = useContext(AutoCarouselSlideContext)
  if (!context) {
    throw new Error('useAutoCarouselSlideIndex must be used within a AutoCarouselSlide')
  }
  return context
}
