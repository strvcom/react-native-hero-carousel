/**
 * Whether the slide at `index` stays mounted while `activeIndex` is the current one.
 * Both are indexes into the rendered slides. With infinite scroll those start and end with a
 * clone, so the distance is measured between the real slides and wraps around: the slide a clone
 * jumps to is then always mounted.
 */
export const isInRenderWindow = ({
  index,
  activeIndex,
  slideCount,
  renderWindow,
  isInfinite,
}: {
  index: number
  activeIndex: number
  /** Number of real slides, clones excluded. */
  slideCount: number
  /** Slides kept mounted on each side of the current one. Everything is mounted when omitted. */
  renderWindow: number | undefined
  isInfinite: boolean
}) => {
  if (renderWindow === undefined) return true
  if (!isInfinite) return Math.abs(index - activeIndex) <= renderWindow

  const toReal = (renderedIndex: number) => (renderedIndex - 1 + slideCount) % slideCount
  const distance = Math.abs(toReal(index) - toReal(activeIndex))

  return Math.min(distance, slideCount - distance) <= renderWindow
}
