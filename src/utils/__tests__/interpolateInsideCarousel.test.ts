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

  it('should correctly interpolate value for slide 2 with length 4', () => {
    const result = interpolateInsideCarousel(2, 2, 4, {
      valueBefore: 0,
      thisValue: 1,
      valueAfter: 0,
    })
    expect(result).toBe(1)
  })

  it('should correctly interpolate value after slide 2 for slide 3', () => {
    const result = interpolateInsideCarousel(2, 3, 5, {
      valueBefore: 0,
      thisValue: 1,
      valueAfter: 2,
    })
    expect(result).toBe(2)
  })

  it('should correctly interpolate value before slide 2 for slide 1', () => {
    const result = interpolateInsideCarousel(2, 1, 5, {
      valueBefore: 2,
      thisValue: 1,
      valueAfter: 0,
    })
    expect(result).toBe(2)
  })

  it('should correctly interpolate value before slide 2 for slide 1 with length 4', () => {
    const result = interpolateInsideCarousel(2, 1, 4, {
      valueBefore: 2,
      thisValue: 1,
      valueAfter: 0,
    })
    expect(result).toBe(2)
  })

  it('should correctly interpolate value after slide 2 for slide 3 with length 4', () => {
    const result = interpolateInsideCarousel(2, 3, 4, {
      valueBefore: 0,
      thisValue: 1,
      valueAfter: 2,
    })
    expect(result).toBe(2)
  })

  it('should correctly interpolate in between value for slide 3 with length 5', () => {
    const result = interpolateInsideCarousel(2.5, 3, 5, {
      valueBefore: 0,
      thisValue: 100,
      valueAfter: 0,
    })
    expect(result).toBe(50)
  })

  it('should correctly interpolate value for slide 0 with length 1', () => {
    const result = interpolateInsideCarousel(0, 0, 1, {
      valueBefore: 0,
      thisValue: 1,
      valueAfter: 0,
    })
    expect(result).toBe(1)
  })

  it('should throw error for scroll values outside range', () => {
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

  it('should throw error for slide index out of bounds', () => {
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
  it('should correctly interpolate in between value from 1 to 2 for slide 2 with offset', () => {
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

  it('should correctly interpolate in between value from 4 to 3 for slide 3 with offset', () => {
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

  // offset tests

  it('should correctly interpolate in between value for slide 2 with offset', () => {
    const result = interpolateInsideCarousel(1.1, 2, 5, {
      valueBefore: 1,
      thisValue: 1,
      valueAfter: 0,
      offset: 0.3,
    })
    expect(result).toBe(0)
  })

  it('should correctly interpolate in between value for slide 2 with offset and length 4', () => {
    const result = interpolateInsideCarousel(1.1, 2, 4, {
      valueBefore: 1,
      thisValue: 1,
      valueAfter: 0,
      offset: 0.1,
    })
    expect(result).toBe(0)
  })

  it('should correctly interpolate in between value for slide 4 with offset', () => {
    const result = interpolateInsideCarousel(3.3, 4, 5, {
      valueBefore: 1,
      thisValue: 1,
      valueAfter: 0,
      offset: 0.5,
    })
    expect(Math.round(result)).toBe(0)
  })

  // mirroring tests
  // slides at the end of the carousel and at the beginning have to mirror their state
  // when transition from padding slide to its real counterpart starts happening real slide
  // already should be in the active state so there is no visible transition.

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

  it('should correctly mirror between first and last slide with offset', () => {
    const result = interpolateInsideCarousel(0.9, 5, 7, {
      valueBefore: 0,
      thisValue: 1,
      valueAfter: 1,
      offset: 0.1,
    })
    expect(result).toBe(1)
  })
})
