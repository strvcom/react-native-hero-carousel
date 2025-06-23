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
      valueBefore: 0,
      thisValue: 1,
      valueAfter: 0,
    })
    expect(result).toBe(1)
  })

  it('should correctly interpolate value for slide 0', () => {
    const result = interpolateInsideCarousel(3, 0, 5, {
      valueBefore: 0,
      thisValue: 1,
      valueAfter: 0,
    })
    expect(result).toBe(1)
  })

  it('should correctly interpolate value for slide 4', () => {
    const result = interpolateInsideCarousel(4, 4, 5, {
      valueBefore: 0,
      thisValue: 1,
      valueAfter: 0,
    })
    expect(result).toBe(1)
  })

  it('should correctly interpolate with length 4', () => {
    const result = interpolateInsideCarousel(2, 2, 4, {
      valueBefore: 0,
      thisValue: 1,
      valueAfter: 0,
    })
    expect(result).toBe(1)
  })

  it('should correctly interpolate outgoing value', () => {
    const result = interpolateInsideCarousel(2, 3, 5, {
      valueBefore: 0,
      thisValue: 1,
      valueAfter: 2,
    })
    expect(result).toBe(2)
  })

  it('should correctly interpolate incoming value', () => {
    const result = interpolateInsideCarousel(2, 1, 5, {
      valueBefore: 2,
      thisValue: 1,
      valueAfter: 0,
    })
    expect(result).toBe(2)
  })

  it('should correctly interpolate incoming value with length 4', () => {
    const result = interpolateInsideCarousel(2, 1, 4, {
      valueBefore: 2,
      thisValue: 1,
      valueAfter: 0,
    })
    expect(result).toBe(2)
  })

  it('should correctly interpolate outgoing value with length 4', () => {
    const result = interpolateInsideCarousel(2, 3, 4, {
      valueBefore: 0,
      thisValue: 1,
      valueAfter: 2,
    })
    expect(result).toBe(2)
  })

  it('should correctly interpolate value if slide is not visible', () => {
    const result = interpolateInsideCarousel(2, 0, 5, {
      valueBefore: 0,
      thisValue: 1,
      valueAfter: 0,
    })
    expect(result).toBe(0)
  })

  it('should handle transitions between slides', () => {
    const result = interpolateInsideCarousel(2.5, 3, 5, {
      valueBefore: 0,
      thisValue: 100,
      valueAfter: 0,
    })
    expect(result).toBe(50)
  })

  it('should handle edge cases with minimum slides', () => {
    const result = interpolateInsideCarousel(0, 0, 1, {
      valueBefore: 0,
      thisValue: 1,
      valueAfter: 0,
    })
    expect(result).toBe(1)
  })

  it('should handle scroll values outside range', () => {
    // Test negative scroll value
    expect(() =>
      interpolateInsideCarousel(-1, 1, 5, {
        valueBefore: 0,
        thisValue: 1,
        valueAfter: 0,
      }),
    ).toThrow()

    // Test scroll value beyond total length
    expect(() =>
      interpolateInsideCarousel(6, 1, 5, {
        valueBefore: 0,
        thisValue: 1,
        valueAfter: 0,
      }),
    ).toThrow() // Should clamp to thisSlide value
  })

  it('should handle slide index out of bounds', () => {
    expect(() =>
      interpolateInsideCarousel(1, -1, 5, {
        valueBefore: 0,
        thisValue: 1,
        valueAfter: 0,
      }),
    ).toThrow()

    expect(() =>
      interpolateInsideCarousel(1, 6, 5, {
        valueBefore: 0,
        thisValue: 1,
        valueAfter: 0,
      }),
    ).toThrow()
  })

  // offset tests
  it('should correctly interpolate value for slide 1 with offset', () => {
    const result = interpolateInsideCarousel(1.2, 2, 5, {
      valueBefore: 0,
      thisValue: 100,
      valueAfter: 0,
      offset: 0.2,
    })
    expect(result).toBe(0)
    const result2 = interpolateInsideCarousel(1.6, 2, 5, {
      valueBefore: 0,
      thisValue: 100,
      valueAfter: 0,
      offset: 0.2,
    })
    // for some reason it is actually 50.00000000000004, so we round it to 50
    expect(Math.round(result2)).toBe(50)

    const result3 = interpolateInsideCarousel(2, 2, 5, {
      valueBefore: 0,
      thisValue: 100,
      valueAfter: 0,
    })
    expect(result3).toBe(100)
  })

  it('should correctly interpolate value from the other side', () => {
    const result = interpolateInsideCarousel(3.8, 3, 5, {
      valueBefore: 0,
      thisValue: 100,
      valueAfter: 0,
      offset: 0.2,
    })
    expect(result).toBe(0)
    const result2 = interpolateInsideCarousel(3.4, 3, 5, {
      valueBefore: 0,
      thisValue: 100,
      valueAfter: 0,
      offset: 0.2,
    })
    expect(Math.round(result2)).toBe(50)
    const result3 = interpolateInsideCarousel(3, 3, 5, {
      valueBefore: 0,
      thisValue: 100,
      valueAfter: 0,
      offset: 0.2,
    })
    expect(result3).toBe(100)
  })

  it('should handle offset between 1 and 2', () => {
    const result = interpolateInsideCarousel(1.1, 2, 7, {
      valueBefore: 1,
      thisValue: 1,
      valueAfter: 0,
      offset: 0.3,
    })
    expect(result).toBe(0)
  })

  it('should handle offset between 1 and 2 with length 4', () => {
    const result = interpolateInsideCarousel(1.1, 2, 4, {
      valueBefore: 1,
      thisValue: 1,
      valueAfter: 0,
      offset: 0.1,
    })
    expect(result).toBe(0)
  })

  it('should handle offset between 3 and 4', () => {
    const result = interpolateInsideCarousel(3.3, 4, 7, {
      valueBefore: 1,
      thisValue: 1,
      valueAfter: 0,
      offset: 0.5,
    })
    expect(Math.round(result)).toBe(0)
  })

  it('should correctly mirror between last and first slide', () => {
    const result = interpolateInsideCarousel(3.5, 1, 5, {
      valueBefore: 1,
      thisValue: 1,
      valueAfter: 0,
      offset: 0,
    })
    expect(result).toBe(1)
  })

  it('should correctly mirror between last and first with length 4', () => {
    const result = interpolateInsideCarousel(3.5, 1, 4, {
      valueBefore: 1,
      thisValue: 1,
      valueAfter: 0,
      offset: 0,
    })
    expect(result).toBe(1)
  })

  it('should correctly mirror between first and last slide', () => {
    const result = interpolateInsideCarousel(0.5, 5, 7, {
      valueBefore: 0,
      thisValue: 1,
      valueAfter: 1,
      offset: 0,
    })
    expect(result).toBe(1)
  })

  it('should correctly mirror between last and first slide with offset', () => {
    const result = interpolateInsideCarousel(6, 1, 7, {
      valueBefore: 1,
      thisValue: 1,
      valueAfter: 0,
      offset: 0.1,
    })
    expect(result).toBe(1)
  })
})
