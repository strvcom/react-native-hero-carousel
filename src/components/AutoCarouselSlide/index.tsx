import { View } from 'react-native'

export const AutoCarouselSlide = ({
  children,
  width,
}: {
  children: React.ReactNode
  width: number
}) => {
  return <View style={{ flex: 1, width, minWidth: width }}>{children}</View>
}
