import { interpolateInsideCarousel } from '../interpolateInsideCarousel'

// first slide and last slide are padding slides
// 0 - 1 - 2 - 3 - 4
// 0 is copy of 3 4 is copy of 1
// slide index and scroll value work in this boundary

describe('interpolateInsideCarousel', () => {
  it('should correctly interpolate value for slide 1, 2 or 3', () => {
    const result = interpolateInsideCarousel(1, 1, 5, {
      slideBefore: 0,
      thisSlide: 1,
      slideAfter: 0,
      offset: 0,
    })
    expect(result).toBe(1)
  })

  it('should correctly interpolate value for slide 0', () => {
    const result = interpolateInsideCarousel(3, 0, 5, {
      slideBefore: 0,
      thisSlide: 1,
      slideAfter: 0,
      offset: 0,
    })
    expect(result).toBe(1)
  })

  it('should correctly interpolate value for slide 4', () => {
    const result = interpolateInsideCarousel(4, 4, 5, {
      slideBefore: 0,
      thisSlide: 1,
      slideAfter: 0,
      offset: 0,
    })
    expect(result).toBe(1)
  })

  it('should correctly interpolate outgoing value', () => {
    const result = interpolateInsideCarousel(2, 3, 5, {
      slideBefore: 0,
      thisSlide: 1,
      slideAfter: 2,
      offset: 0,
    })
    expect(result).toBe(2)
  })

  it('should correctly interpolate incoming value', () => {
    const result = interpolateInsideCarousel(2, 1, 5, {
      slideBefore: 2,
      thisSlide: 1,
      slideAfter: 0,
      offset: 0,
    })
    expect(result).toBe(2)
  })

  it('should correctly interpolate value if slide is not visible', () => {
    const result = interpolateInsideCarousel(2, 0, 5, {
      slideBefore: 0,
      thisSlide: 1,
      slideAfter: 0,
      offset: 0,
    })
    expect(result).toBe(0)
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

  it('should handle scroll values outside range', () => {
    // Test negative scroll value
    expect(
      interpolateInsideCarousel(-1, 1, 5, {
        slideBefore: 0,
        thisSlide: 1,
        slideAfter: 0,
        offset: 0,
      }),
    ).toThrow()

    // Test scroll value beyond total length
    expect(
      interpolateInsideCarousel(6, 1, 5, {
        slideBefore: 0,
        thisSlide: 1,
        slideAfter: 0,
        offset: 0,
      }),
    ).toThrow() // Should clamp to thisSlide value
  })
})
