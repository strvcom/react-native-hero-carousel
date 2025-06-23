import { Extrapolation, interpolate } from 'react-native-reanimated'

export const interpolateInsideCarousel = (
  scrollValue: number,
  slideIndex: number,
  totalLength: number,
  values: {
    valueBefore: number
    thisValue: number
    valueAfter: number
    offset?: number
  },
) => {
  'worklet'
  const { valueBefore, thisValue, valueAfter, offset = 0 } = values

  if (scrollValue < 0 || scrollValue >= totalLength) {
    throw new Error('scrollValue out of bounds')
  }

  if (slideIndex < 0 || slideIndex >= totalLength) {
    throw new Error('slideIndex out of bounds')
  }

  if (totalLength === 1) {
    return thisValue
  }

  const getAdjustedIndex = (slideIndex: number) => {
    if (slideIndex === 0) return Math.max(totalLength - 2, 0)
    if (slideIndex === totalLength - 1) return 1
    return slideIndex
  }

  const adjustedIndex = getAdjustedIndex(slideIndex)

  const inputRange = Array.from({ length: totalLength }).map((_, index) => {
    if (index < slideIndex) return index + offset
    if (index > slideIndex) return index - offset
    return index
  })
  const outputValues = inputRange.map((_, index) => {
    if (index === adjustedIndex) return thisValue
    if (index === slideIndex) return thisValue
    if (index < slideIndex) return valueAfter
    if (index > slideIndex) return valueBefore
    return 0
  })

  return interpolate(scrollValue, inputRange, outputValues, Extrapolation.CLAMP)
}
