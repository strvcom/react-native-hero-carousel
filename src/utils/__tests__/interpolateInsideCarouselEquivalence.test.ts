import { Extrapolation, interpolate } from 'react-native-reanimated'

import { interpolateInsideCarousel } from '../interpolateInsideCarousel'

// The previous implementation, which built a point for every slide.
const interpolateOverAllSlides = (
  scrollValue: number,
  slideIndex: number,
  totalLength: number,
  values: { valueBefore: number; thisValue: number; valueAfter: number; offset?: number },
  isInfinite: boolean,
) => {
  const { valueBefore, thisValue, valueAfter, offset = 0 } = values

  if (totalLength === 1) return thisValue

  const getAdjustedIndex = (index: number) => {
    if (!isInfinite) return index
    if (index === 0) return Math.max(totalLength - 2, 0)
    if (index === totalLength - 1) return 1
    if (index === 1) return totalLength - 1
    return index
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
    return valueBefore
  })

  return interpolate(scrollValue, inputRange, outputValues, Extrapolation.CLAMP)
}

describe('interpolateInsideCarousel matches interpolating over every slide', () => {
  const valueSets = [
    { valueBefore: 0, thisValue: 1, valueAfter: 0 },
    { valueBefore: 20, thisValue: 0, valueAfter: -20 },
    { valueBefore: 0, thisValue: 100, valueAfter: 50, offset: 0.2 },
  ]

  for (const isInfinite of [true, false]) {
    for (const totalLength of [2, 3, 4, 7, 12]) {
      it(`${totalLength} slides, infinite ${isInfinite}`, () => {
        for (const values of valueSets) {
          for (let slideIndex = 0; slideIndex < totalLength; slideIndex++) {
            for (let step = 0; step <= (totalLength - 1) * 20; step++) {
              const scrollValue = step / 20
              expect(
                interpolateInsideCarousel(scrollValue, slideIndex, totalLength, values, isInfinite),
              ).toBeCloseTo(
                interpolateOverAllSlides(scrollValue, slideIndex, totalLength, values, isInfinite),
                10,
              )
            }
          }
        }
      })
    }
  }
})
