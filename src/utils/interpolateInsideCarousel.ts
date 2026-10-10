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
  // With infinite scroll the first and last slides are clones, so a slide also counts as current
  // while its clone is.
  isInfinite = true,
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
    if (!isInfinite) return slideIndex
    if (slideIndex === 0) return Math.max(totalLength - 2, 0)
    if (slideIndex === totalLength - 1) return 1
    if (slideIndex === 1) return totalLength - 1
    return slideIndex
  }

  const adjustedIndex = getAdjustedIndex(slideIndex)

  // Only the points around the slide and around its clone change the result. Every other point
  // sits on a flat stretch between two of these, so leaving it out gives the same value, and the
  // work no longer grows with the number of slides.
  const indexes: number[] = []
  for (const center of [slideIndex, adjustedIndex]) {
    for (let index = center - 1; index <= center + 1; index++) {
      if (index >= 0 && index < totalLength && !indexes.includes(index)) indexes.push(index)
    }
  }
  indexes.sort((a, b) => a - b)

  const inputRange = indexes.map((index) => {
    if (index < slideIndex) return index + offset
    if (index > slideIndex) return index - offset
    return index
  })
  const outputValues = indexes.map((index) => {
    if (index === adjustedIndex) return thisValue
    if (index === slideIndex) return thisValue
    if (index < slideIndex) return valueAfter
    return valueBefore
  })

  return interpolate(scrollValue, inputRange, outputValues, Extrapolation.CLAMP)
}
