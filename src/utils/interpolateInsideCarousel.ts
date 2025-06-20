import { Extrapolation, interpolate } from 'react-native-reanimated'

const offsetScrollValue = (scrollValue: number, slideIndex: number, offset: number) => {
  'worklet'
  return interpolate(
    scrollValue,
    [slideIndex - 1 + offset, slideIndex, slideIndex + 1 - offset],
    [slideIndex - 1, slideIndex, slideIndex + 1],
    Extrapolation.CLAMP,
  )
}

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

  console.log('scrollValue', scrollValue)
  console.log('inputRange', inputRange)

  const outputValues = [
    thisValue,
    valueBefore,
    valueAfter,
    thisValue,
    valueBefore,
    valueAfter,
    thisValue,
  ]

  console.log('outputValues', outputValues)

  return interpolate(scrollValue, inputRange, outputValues, Extrapolation.CLAMP)
}
