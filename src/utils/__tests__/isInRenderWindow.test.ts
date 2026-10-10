import { isInRenderWindow } from '../isInRenderWindow'

describe('isInRenderWindow', () => {
  it('mounts every slide without a render window', () => {
    expect(
      isInRenderWindow({
        index: 40,
        activeIndex: 0,
        slideCount: 50,
        renderWindow: undefined,
        isInfinite: false,
      }),
    ).toBe(true)
  })

  it('mounts slides within the window around the current one', () => {
    const check = (index: number) =>
      isInRenderWindow({
        index,
        activeIndex: 10,
        slideCount: 50,
        renderWindow: 2,
        isInfinite: false,
      })

    expect([7, 8, 9, 10, 11, 12, 13].map(check)).toEqual([
      false,
      true,
      true,
      true,
      true,
      true,
      false,
    ])
  })

  // With infinite scroll and 10 slides, rendered index 0 clones slide 9, 1-10 are the real slides
  // and 11 clones slide 0.
  const infinite = (index: number, activeIndex: number) =>
    isInRenderWindow({ index, activeIndex, slideCount: 10, renderWindow: 2, isInfinite: true })

  it('keeps the first real slide mounted while on the clone at the end', () => {
    expect(infinite(1, 11)).toBe(true)
  })

  it('keeps the last real slide mounted while on the clone at the start', () => {
    expect(infinite(10, 0)).toBe(true)
  })

  it('wraps the window around the ends', () => {
    // On the first real slide, the last two real slides are its neighbours to the left.
    expect(infinite(10, 1)).toBe(true)
    expect(infinite(9, 1)).toBe(true)
    expect(infinite(8, 1)).toBe(false)
  })
})
