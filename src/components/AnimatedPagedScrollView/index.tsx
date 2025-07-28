import { forwardRef, type ForwardedRef } from 'react'
import { View } from 'react-native'
import Animated, { type AnimatedScrollViewProps } from 'react-native-reanimated'

import { styles } from './styles'

// currently not used scroll view, it is here in case custom scroll has issues

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

AnimatedPagedScrollView.displayName = 'AnimatedPagedScrollView'
