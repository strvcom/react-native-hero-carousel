import { useAutoCarouselSlideIndex, useCarouselContext } from '../context'
import { interpolateInsideCarousel } from '../utils'
import { useDerivedValue } from 'react-native-reanimated'

export const useInterpolateInsideCarousel = (values: {
  valueBefore: number
  thisValue: number
  valueAfter: number
  offset?: number
}) => {
  const { scrollValue } = useCarouselContext()
  const { index, total } = useAutoCarouselSlideIndex()
  return useDerivedValue(() => {
    return interpolateInsideCarousel(scrollValue.value, index, total, values)
  }, [scrollValue, values])
}
