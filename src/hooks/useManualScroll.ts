import { useCallback, useMemo } from 'react'
import { useSharedValue, withTiming } from 'react-native-reanimated'

export const DEFAULT_ANIMATION = (to: number, duration: number) => withTiming(to, { duration })

export const useManualScroll = ({
  slideWidth,
  defaultScrollValue,
}: {
  slideWidth: number
  defaultScrollValue: number
}) => {
  const manualScrollValue = useSharedValue({ value: slideWidth })
  const scrollValue = useSharedValue(defaultScrollValue)

  const goToPage = useCallback(
    (page: number, duration = 0, animation = DEFAULT_ANIMATION) => {
      'worklet'
      const to = page * slideWidth
      if (duration) {
        manualScrollValue.value = { value: animation(to, duration) }
      } else {
        manualScrollValue.value = { value: to }
      }
    },
    [manualScrollValue, slideWidth],
  )

  const goToNextPage = useCallback(() => {
    'worklet'
    goToPage(manualScrollValue.value.value + 1)
  }, [goToPage, manualScrollValue])

  return useMemo(
    () => ({
      manualScrollValue,
      scrollValue,
      goToPage,
      goToNextPage,
    }),
    [manualScrollValue, scrollValue, goToPage, goToNextPage],
  )
}
