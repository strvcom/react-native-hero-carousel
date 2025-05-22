import { AnimatedPagedScrollView } from './index'
import Animated, {
  scrollTo,
  SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
} from 'react-native-reanimated'
import { customRound } from '../../utils/round'
import { ROUNDING_PRECISION } from '../../components/AutoCarousel/index.preset'
import { useCarouselContext } from '../../context/CarouselContext'

type Props = {
  onScroll: (value: number) => void
  children: React.ReactNode
  offset: SharedValue<{ value: number }>
}

export const AutoCarouselAdapter = ({ onScroll, children, offset }: Props) => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>()
  const { slideWidth, setUserInteracted } = useCarouselContext()

  useAnimatedReaction(
    () => offset.value.value,
    (value) => {
      scrollTo(scrollViewRef, value, 0, false)
    },
  )

  const scrollHandler = useAnimatedScrollHandler(
    (event) => {
      const activeIndex = customRound(event.contentOffset.x / slideWidth, ROUNDING_PRECISION)
      if (event.contentOffset.x === 0) return
      onScroll(activeIndex)
    },
    [slideWidth],
  )

  return (
    <AnimatedPagedScrollView
      ref={scrollViewRef}
      onScroll={scrollHandler}
      onScrollBeginDrag={() => {
        setUserInteracted(true)
      }}
    >
      {children}
    </AnimatedPagedScrollView>
  )
}
