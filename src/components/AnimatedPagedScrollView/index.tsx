import { forwardRef, type ForwardedRef } from 'react'
import { View } from 'react-native'
import Animated, { type AnimatedScrollViewProps } from 'react-native-reanimated'

import { styles } from './styles'

export const AnimatedPagedScrollView = forwardRef(
  (props: AnimatedScrollViewProps, ref: ForwardedRef<Animated.ScrollView>) => {
    return (
      <View style={styles.container}>
        <Animated.ScrollView
          ref={ref}
          horizontal
          pagingEnabled
          scrollToOverflowEnabled
          showsHorizontalScrollIndicator={false}
          {...props}
        />
      </View>
    )
  },
)

export type AnimatedPagedScrollViewRef = {
  scrollTo: (value: number) => void
}

AnimatedPagedScrollView.displayName = 'AnimatedPagedScrollView'
