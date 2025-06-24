import { createContext, useContext, useMemo, useState } from 'react'
import { useSharedValue, type SharedValue } from 'react-native-reanimated'

import { Dimensions } from 'react-native'

const windowWidth = Dimensions.get('window').width

export const CarouselContext = createContext<{
  scrollValue: SharedValue<number>
  timeoutValue: SharedValue<number>
  slideWidth: number
  userInteracted: boolean
  setUserInteracted: (interacted: boolean) => void
} | null>(null)

export const useCarouselContext = () => {
  const context = useContext(CarouselContext)
  if (!context) {
    throw new Error('useCarouselContext must be used within a CarouselProvider')
  }
  return context
}

export const CarouselContextProvider = ({
  children,
  defaultScrollValue = 1,
  slideWidth = windowWidth,
}: {
  children: React.ReactNode
  defaultScrollValue?: number
  slideWidth?: number
}) => {
  const scrollValue = useSharedValue(defaultScrollValue)
  const timeoutValue = useSharedValue(0)
  const [userInteracted, setUserInteracted] = useState(false)

  return (
    <CarouselContext.Provider
      value={useMemo(
        () => ({ scrollValue, userInteracted, setUserInteracted, slideWidth, timeoutValue }),
        [scrollValue, userInteracted, setUserInteracted, slideWidth, timeoutValue],
      )}
    >
      {children}
    </CarouselContext.Provider>
  )
}
