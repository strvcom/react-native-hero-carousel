import { Extrapolation, interpolate } from 'react-native-reanimated'

const offsetScrollValue = (scrollValue: number, slideIndex: number, offset: number) => {
  return interpolate(
    scrollValue,
    [slideIndex - 1 + offset, slideIndex, slideIndex + 1 - offset],
    [slideIndex - 1, slideIndex, slideIndex + 1],
  )
}

export const interpolateInsideCarousel = (
  scrollValue: number,
  slideIndex: number,
  totalLength: number,
  values: {
    slideBefore: number
    thisSlide: number
    slideAfter: number
    offset?: number
  },
) => {
  'worklet'
  const { slideBefore: incoming, thisSlide: inside, slideAfter: outgoing, offset = 0 } = values

  if (scrollValue < 0 || scrollValue >= totalLength) {
    throw new Error('scrollValue out of bounds')
  }

  if (slideIndex < 0 || slideIndex >= totalLength) {
    throw new Error('slideIndex out of bounds')
  }

  if (totalLength === 1) {
    return inside
  }

  let adjustedIndex = slideIndex

  if (slideIndex === 0) {
    adjustedIndex = Math.max(totalLength - 2, 0)
  }

  if (slideIndex === totalLength - 1) {
    adjustedIndex = 1
  }

  const inputRange = [
    0,
    Math.min(1, adjustedIndex - 1),
    adjustedIndex - 1,
    adjustedIndex,
    adjustedIndex + 1,
    Math.max(totalLength - 2, adjustedIndex + 1),
    totalLength - 1,
  ]

  const outputValues = [inside, incoming, outgoing, inside, incoming, outgoing, inside]

  return interpolate(
    offset ? offsetScrollValue(scrollValue, slideIndex, offset) : scrollValue,
    inputRange,
    outputValues,
    Extrapolation.CLAMP,
  )
}
