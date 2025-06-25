import { createContext, useContext } from 'react'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import { useCore } from '../../hooks/useCore'

export const AutoCarouselSlideContext = createContext<{
  index: number
  total: number
  runAutoScroll: ReturnType<typeof useAutoScroll>['runAutoScroll']
  goToPage: ReturnType<typeof useCore>['goToPage']
} | null>(null)

export const useAutoCarouselSlideIndex = () => {
  const context = useContext(AutoCarouselSlideContext)
  if (!context) {
    throw new Error('useAutoCarouselSlideIndex must be used within a AutoCarouselSlide')
  }
  return context
}
