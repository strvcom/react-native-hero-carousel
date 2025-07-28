import { createContext, useContext, useMemo, useState } from 'react'
import { useSharedValue } from 'react-native-reanimated'

import { Dimensions } from 'react-native'
import { DEFAULT_ANIMATION, useManualScroll } from '../../hooks/useManualScroll'
import { DEFAULT_INTERVAL } from '../../components/HeroCarousel/index.preset'

const windowWidth = Dimensions.get('window').width

export const CarouselContext = createContext<
  | (ReturnType<typeof useManualScroll> &
      ReturnType<typeof useUserInteracted> &
      Omit<ContextProps, 'children'>)
  | null
>(null)

export const useCarouselContext = () => {
  const context = useContext(CarouselContext)
  if (!context) {
    throw new Error('useCarouselContext must be used within a CarouselProvider')
  }
  return context
}

const useUserInteracted = () => {
  const timeoutValue = useSharedValue(0)
  const [userInteracted, setUserInteracted] = useState(false)
  return useMemo(
    () => ({ userInteracted, setUserInteracted, timeoutValue }),
    [userInteracted, setUserInteracted, timeoutValue],
  )
}

type ContextProps = {
  children: React.ReactNode
  initialIndex?: number
  slideWidth?: number
  disableInfiniteScroll?: boolean
  interval?: number | ((index: number) => number)
  disableAutoScroll?: boolean
  autoScrollAnimation?: (to: number, duration: number) => number
}

export const CarouselContextProvider = ({
  children,
  initialIndex = 0,
  slideWidth = windowWidth,
  disableInfiniteScroll = false,
  interval = DEFAULT_INTERVAL,
  disableAutoScroll = false,
  autoScrollAnimation = DEFAULT_ANIMATION,
}: ContextProps) => {
  const userInteracted = useUserInteracted()
  const manualScroll = useManualScroll({
    slideWidth,
    initialIndex: disableInfiniteScroll ? initialIndex : initialIndex + 1,
  })

  return (
    <CarouselContext.Provider
      value={useMemo(
        () => ({
          ...manualScroll,
          ...userInteracted,
          slideWidth,
          disableInfiniteScroll,
          interval,
          disableAutoScroll,
          autoScrollAnimation,
        }),
        [
          manualScroll,
          userInteracted,
          slideWidth,
          disableInfiniteScroll,
          interval,
          disableAutoScroll,
          autoScrollAnimation,
        ],
      )}
    >
      {children}
    </CarouselContext.Provider>
  )
}
