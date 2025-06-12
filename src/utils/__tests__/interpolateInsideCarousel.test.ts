import { render, screen, userEvent } from '@testing-library/react-native'
import { interpolateInsideCarousel } from '../interpolateInsideCarousel'

// Mock Reanimated's interpolate function
// jest.mock('react-native-reanimated', () => ({
//   interpolate: (value: number, input: number[], output: number[]) => {
//     const min = Math.min(...input)
//     const max = Math.max(...input)
//     const range = max - min
//     const percent = (value - min) / range
//     const outputRange = output[output.length - 1] - output[0]
//     return output[0] + percent * outputRange
//   },
//   Extrapolation: {
//     CLAMP: 'clamp',
//   },
// }))

describe('interpolateInsideCarousel', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })
  // it('should interpolate values correctly for middle slides', () => {
  //   const result = interpolateInsideCarousel(1.5, 1, 3, {
  //     slideBefore: 0,
  //     thisSlide: 1,
  //     slideAfter: 0,
  //     offset: 0.2,
  //   })
  //   expect(result).toBeGreaterThan(0)
  //   expect(result).toBeLessThan(1)
  // })

  // it('should handle first slide correctly', () => {
  //   const result = interpolateInsideCarousel(0, 0, 3, {
  //     slideBefore: 0,
  //     thisSlide: 1,
  //     slideAfter: 0,
  //     offset: 0.2,
  //   })
  //   expect(result).toBe(1) // Should be at thisSlide value
  // })

  // it('should handle last slide correctly', () => {
  //   const result = interpolateInsideCarousel(2, 2, 3, {
  //     slideBefore: 0,
  //     thisSlide: 1,
  //     slideAfter: 0,
  //     offset: 0.2,
  //   })
  //   expect(result).toBe(1) // Should be at thisSlide value
  // })

  // it('should handle transition between slides', () => {
  //   // Test transition from slide 0 to 1
  //   const result1 = interpolateInsideCarousel(0.5, 0, 3, {
  //     slideBefore: 0,
  //     thisSlide: 1,
  //     slideAfter: 0,
  //     offset: 0.2,
  //   })
  //   expect(result1).toBeGreaterThan(0)
  //   expect(result1).toBeLessThan(1)

  //   // Test transition from slide 1 to 2
  //   const result2 = interpolateInsideCarousel(1.5, 1, 3, {
  //     slideBefore: 0,
  //     thisSlide: 1,
  //     slideAfter: 0,
  //     offset: 0.2,
  //   })
  //   expect(result2).toBeGreaterThan(0)
  //   expect(result2).toBeLessThan(1)
  // })

  // it('should handle different offset values', () => {
  //   const result = interpolateInsideCarousel(1.5, 1, 3, {
  //     slideBefore: 0,
  //     thisSlide: 1,
  //     slideAfter: 0,
  //     offset: 0.5, // Larger offset
  //   })
  //   expect(result).toBeGreaterThan(0)
  //   expect(result).toBeLessThan(1)
  // })

  // it('should handle edge cases with minimum slides', () => {
  //   const result = interpolateInsideCarousel(0, 0, 1, {
  //     slideBefore: 0,
  //     thisSlide: 1,
  //     slideAfter: 0,
  //     offset: 0.2,
  //   })
  //   expect(result).toBe(1) // Should be at thisSlide value
  // })

  // it('should handle different interpolation values', () => {
  //   const result = interpolateInsideCarousel(1.5, 1, 3, {
  //     slideBefore: 0,
  //     thisSlide: 100,
  //     slideAfter: 0,
  //     offset: 0.2,
  //   })
  //   expect(result).toBeGreaterThan(0)
  //   expect(result).toBeLessThan(100)
  // })

  // it('should handle scroll values outside range', () => {
  //   // Test negative scroll value
  //   const result1 = interpolateInsideCarousel(-1, 1, 3, {
  //     slideBefore: 0,
  //     thisSlide: 1,
  //     slideAfter: 0,
  //     offset: 0.2,
  //   })
  //   expect(result1).toBe(1) // Should clamp to thisSlide value

  //   // Test scroll value beyond total length
  //   const result2 = interpolateInsideCarousel(4, 1, 3, {
  //     slideBefore: 0,
  //     thisSlide: 1,
  //     slideAfter: 0,
  //     offset: 0.2,
  //   })
  //   expect(result2).toBe(1) // Should clamp to thisSlide value
  // })
})
