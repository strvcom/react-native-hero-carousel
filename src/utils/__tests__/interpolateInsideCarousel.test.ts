import { interpolateInsideCarousel } from '../interpolateInsideCarousel'

// first slide and last slide are padding slides
// 0 - 1 - 2 - 3 - 4
// 0 is copy of 3 4 is copy of 1
// slide index and scroll value work in this boundary

// offset can delay some animation to start at later point in the transition
// with offset 0 interpolation starts on change from previous index, so for this params:
// {
//   slideBefore: 0,
//   thisSlide: 100,
//   slideAfter: 0
//   offset: 0,
// }
// value on scrollValue 3 for index 3 is 0. For 4 is 100 and for 3.5 is 50.

// on the other side going from slide 5 to 4 (or 4 to 5) with offset 0.2
// interpolation starts at 4.8 and ends at 4.

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

  it('should handle transitions between slides', () => {
    const result = interpolateInsideCarousel(2.5, 3, 5, {
      slideBefore: 0,
      thisSlide: 100,
      slideAfter: 0,
      offset: 0,
    })
    expect(result).toBe(50)
  })

  it('should handle edge cases with minimum slides', () => {
    const result = interpolateInsideCarousel(0, 0, 1, {
      slideBefore: 0,
      thisSlide: 1,
      slideAfter: 0,
      offset: 0.2,
    })
    expect(result).toBe(1)
  })

  it('should handle scroll values outside range', () => {
    // Test negative scroll value
    expect(() =>
      interpolateInsideCarousel(-1, 1, 5, {
        slideBefore: 0,
        thisSlide: 1,
        slideAfter: 0,
        offset: 0,
      }),
    ).toThrow()

    // Test scroll value beyond total length
    expect(() =>
      interpolateInsideCarousel(6, 1, 5, {
        slideBefore: 0,
        thisSlide: 1,
        slideAfter: 0,
        offset: 0,
      }),
    ).toThrow() // Should clamp to thisSlide value
  })

  it('should handle slide index out of bounds', () => {
    expect(() =>
      interpolateInsideCarousel(1, -1, 5, {
        slideBefore: 0,
        thisSlide: 1,
        slideAfter: 0,
        offset: 0,
      }),
    ).toThrow()

    expect(() =>
      interpolateInsideCarousel(1, 6, 5, {
        slideBefore: 0,
        thisSlide: 1,
        slideAfter: 0,
        offset: 0,
      }),
    ).toThrow()
  })

  // offset tests
  it('should correctly interpolate value for slide 1 with offset', () => {
    const result = interpolateInsideCarousel(1.2, 2, 5, {
      slideBefore: 0,
      thisSlide: 100,
      slideAfter: 0,
      offset: 0.2,
    })
    expect(result).toBe(0)
    const result2 = interpolateInsideCarousel(1.6, 2, 5, {
      slideBefore: 0,
      thisSlide: 100,
      slideAfter: 0,
      offset: 0.2,
    })
    // for some reason it is actually 50.00000000000004, so we round it to 50
    expect(Math.round(result2)).toBe(50)

    const result3 = interpolateInsideCarousel(2, 2, 5, {
      slideBefore: 0,
      thisSlide: 100,
      slideAfter: 0,
      offset: 0.2,
    })
    expect(result3).toBe(100)
  })

  it('should correctly interpolate value from the other side', () => {
    const result = interpolateInsideCarousel(3.8, 3, 5, {
      slideBefore: 0,
      thisSlide: 100,
      slideAfter: 0,
      offset: 0.2,
    })
    expect(result).toBe(0)
    const result2 = interpolateInsideCarousel(3.4, 3, 5, {
      slideBefore: 0,
      thisSlide: 100,
      slideAfter: 0,
      offset: 0.2,
    })
    expect(Math.round(result2)).toBe(50)
    const result3 = interpolateInsideCarousel(3, 3, 5, {
      slideBefore: 0,
      thisSlide: 100,
      slideAfter: 0,
      offset: 0.2,
    })
    expect(result3).toBe(100)
  })
})
