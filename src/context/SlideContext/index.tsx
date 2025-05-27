import { createContext, useContext } from 'react'

export const AutoCarouselSlideContext = createContext<{ index: number; total: number } | null>(null)

export const useAutoCarouselSlideIndex = () => {
  const context = useContext(AutoCarouselSlideContext)
  if (!context) {
    throw new Error('useAutoCarouselSlideIndex must be used within a AutoCarouselSlide')
  }
  return context
}
