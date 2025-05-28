import { Extrapolation, interpolate, SharedValue } from 'react-native-reanimated'

export const interpolateInsideCarousel = (
  scrollValue: SharedValue<number>,
  slideIndex: number,
  totalLength: number,
  values: {
    slideBefore: number
    thisSlide: number
    slideAfter: number
    offset: number
  },
) => {
  'worklet'
  const { offset, slideBefore: incoming, thisSlide: inside, slideAfter: outgoing } = values
  let adjustedIndex = slideIndex

  if (slideIndex === 0) {
    adjustedIndex = Math.max(totalLength - 2, 0)
  }

  if (slideIndex === totalLength - 1) {
    adjustedIndex = 1
  }

  const inputRange = [
    0,
    Math.min(1, adjustedIndex - 1) - offset,
    adjustedIndex - 1 + offset,
    adjustedIndex,
    adjustedIndex + 1 - offset,
    Math.max(totalLength - 2, adjustedIndex + 1) + offset,
    totalLength - 1,
  ]

  const outputValues = [inside, incoming, outgoing, inside, incoming, outgoing, inside]

  return interpolate(scrollValue.value, inputRange, outputValues, Extrapolation.CLAMP)
}
