import { View } from 'react-native'
import { AutoCarouselSlideContext } from '../../context/SlideContext'

export const AutoCarouselSlide = ({
  children,
  width,
  index,
  total,
}: {
  children: React.ReactNode
  width: number
  index: number
  total: number
}) => {
  return (
    <View style={{ flex: 1, width, minWidth: width }}>
      <AutoCarouselSlideContext.Provider value={{ index, total }}>
        {children}
      </AutoCarouselSlideContext.Provider>
    </View>
  )
}
