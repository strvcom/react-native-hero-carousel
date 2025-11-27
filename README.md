# React Native Hero Carousel

<div style="display: flex; flex-direction: row; gap: 10px;">
<img src="docs/assets/carousel-demo.webp" alt="Carousel Demo" width="200">
<img src="docs/assets/carousel-demo2.webp" alt="Video Carousel Demo" width="200">
<img src="docs/assets/carousel-demo3.webp" alt="Other Carousel Demo" width="200">
</div>
A highly customizable, performant carousel component for React Native with advanced animations, auto-scrolling capabilities, and infinite scrolling support. Built with React Native Reanimated for smooth, native-level performance.

**✨ Compound Pattern** - Clean, intuitive API with `HeroCarousel.Provider`, `HeroCarousel.Item`, and `HeroCarousel.AnimatedView`  
**✨ Context-Based Configuration** - All carousel settings are configured through the provider for a clean, centralized API.

## Features

✨ **Auto-scrolling** with customizable intervals  
🔄 **Infinite scrolling** with seamless transitions  
🎬 **Video support** with play/pause controls  
⏱️ **Timer-based pagination** with visual progress indicators  
🎯 **Advanced animations** using React Native Reanimated  
📱 **Gesture-friendly** with swipe navigation  
🎨 **Highly customizable** with interpolation utilities  
⚡ **Performance optimized** with worklet functions

## Installation

```bash
npm install @strv/react-native-hero-carousel
# or
yarn add @strv/react-native-hero-carousel
# or
pnpm add @strv/react-native-hero-carousel
```

### Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install react-native-reanimated react-native-gesture-handler
```

Make sure to follow the [React Native Reanimated installation guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started) for your platform.

## Quick Start

```tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { HeroCarousel } from '@strv/react-native-hero-carousel'

const slides = [
  { id: 1, title: 'Slide 1', color: '#FF6B6B' },
  { id: 2, title: 'Slide 2', color: '#4ECDC4' },
  { id: 3, title: 'Slide 3', color: '#45B7D1' },
  { id: 4, title: 'Slide 4', color: '#96CEB4' },
]

const Slide = ({ title, color }: { title: string; color: string }) => (
  <View style={[styles.slide, { backgroundColor: color }]}>
    <Text style={styles.title}>{title}</Text>
  </View>
)

export default function BasicCarousel() {
  return (
    <HeroCarousel.Provider interval={4000} disableAutoScroll={false} initialIndex={0}>
      <View style={styles.container}>
        <HeroCarousel>
          {slides.map((slide) => (
            <Slide key={slide.id} title={slide.title} color={slide.color} />
          ))}
        </HeroCarousel>
      </View>
    </HeroCarousel.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
})
```

## API Reference

### Components

The `HeroCarousel` component uses a **compound pattern** that provides a clean, intuitive API:

```tsx
<HeroCarousel.Provider>
  <HeroCarousel>
    <HeroCarousel.Item>{/* Your slide content */}</HeroCarousel.Item>
  </HeroCarousel>
</HeroCarousel.Provider>
```

#### `HeroCarousel.Provider`

The context provider that must wrap your carousel components. **All carousel configuration is passed here.**

```tsx
<HeroCarousel.Provider
  initialIndex={0} // Initial slide index (default: 0)
  slideWidth={screenWidth} // Width of each slide (default: screen width)
  interval={3000} // Auto-scroll interval in ms
  disableAutoScroll={false} // Disable auto-scrolling
  disableInfiniteScroll={false} // Disable infinite scrolling
  autoScrollAnimation={(to, duration) => withTiming(to, { duration })} // Custom animation
>
  {children}
</HeroCarousel.Provider>
```

**Props:**

| Prop                    | Type                                       | Default      | Description                                                                         |
| ----------------------- | ------------------------------------------ | ------------ | ----------------------------------------------------------------------------------- |
| `initialIndex`          | `number`                                   | `0`          | Initial slide index to start from                                                   |
| `slideWidth`            | `number`                                   | screen width | Width of each slide in pixels                                                       |
| `interval`              | `number \| ((index: number) => number)`    | `3000`       | Auto-scroll interval in milliseconds, or function returning interval for each slide |
| `disableAutoScroll`     | `boolean`                                  | `false`      | Disable automatic scrolling                                                         |
| `disableInfiniteScroll` | `boolean`                                  | `false`      | Disable infinite scrolling (shows first/last slide boundaries)                      |
| `autoScrollAnimation`   | `(to: number, duration: number) => number` | `withTiming` | Custom animation function for auto-scroll transitions                               |
| `children`              | `React.ReactNode`                          | Required     | Carousel content (should contain HeroCarousel component)                            |

#### `HeroCarousel`

The main carousel component that renders slides. **Takes no configuration props** - all configuration is handled by the context provider.

```tsx
<HeroCarousel>
  {slides.map((slide) => (
    <YourSlideComponent key={slide.id} {...slide} />
  ))}
</HeroCarousel>
```

**Props:**

| Prop       | Type                | Description               |
| ---------- | ------------------- | ------------------------- |
| `children` | `React.ReactNode[]` | Array of slide components |

#### `HeroCarousel.Item`

A wrapper component for individual slides. Provides slide context to child components. **Note:** This is automatically used internally when you pass children to `HeroCarousel`, but you can use it directly for more control.

```tsx
<HeroCarousel.Item>{/* Your slide content */}</HeroCarousel.Item>
```

#### `HeroCarousel.AnimatedView`

A specialized animated view component that automatically handles entering/exiting animations based on carousel scroll position. Perfect for creating slide-specific animations.

```tsx
import { FadeIn, FadeOut } from 'react-native-reanimated'
;<HeroCarousel.AnimatedView
  entering={FadeIn.duration(400)}
  exiting={FadeOut.duration(300)}
  style={styles.animatedContent}
>
  <Text>This animates when the slide becomes active</Text>
</HeroCarousel.AnimatedView>
```

**Props:**

| Prop                      | Type                                   | Default  | Description                                              |
| ------------------------- | -------------------------------------- | -------- | -------------------------------------------------------- |
| `children`                | `React.ReactNode`                      | Required | Content to animate                                       |
| `entering`                | `AnimatedProps<ViewProps>['entering']` | -        | Entering animation (from react-native-reanimated)        |
| `exiting`                 | `AnimatedProps<ViewProps>['exiting']`  | -        | Exiting animation (from react-native-reanimated)         |
| `layout`                  | `AnimatedProps<ViewProps>['layout']`   | -        | Layout animation (from react-native-reanimated)          |
| `enteringThreshold`       | `number`                               | `0.99`   | Threshold (0-1) when entering animation should trigger   |
| `exitingThreshold`        | `number`                               | `0.01`   | Threshold (0-1) when exiting animation should trigger    |
| `keepVisibleAfterExiting` | `boolean`                              | `false`  | Keep component visible after exiting animation completes |
| `style`                   | `AnimatedProps<ViewProps>['style']`    | -        | Additional styles                                        |

### Hooks

#### `useCarouselContext()`

Access the carousel's shared state and controls.

```tsx
const { scrollValue, timeoutValue, slideWidth, userInteracted, setUserInteracted } =
  useCarouselContext()
```

**Returns:**

- `scrollValue`: Animated value representing current scroll position
- `timeoutValue`: Animated value for timer progress (0-1)
- `slideWidth`: Width of slides
- `userInteracted`: Boolean indicating if user has interacted with carousel
- `setUserInteracted`: Function to update interaction state

#### `useAutoCarouselSlideIndex()`

Get the current slide information and auto-scroll controls. Must be used within a slide component (inside `HeroCarousel`).

```tsx
const { index, total, runAutoScroll, goToPage } = useAutoCarouselSlideIndex()
```

**Returns:**

- `index`: Current slide index
- `total`: Total number of slides
- `runAutoScroll`: Function to manually trigger auto-scroll with custom interval
- `goToPage`: Function to programmatically navigate to a specific slide from another slide

#### `useInterpolateInsideCarousel()`

Hook for creating custom slide animations with automatic interpolation based on carousel scroll position. Must be used within a slide component (inside `HeroCarousel`). Returns a `SharedValue` that you can use in animated styles.

```tsx
import { useInterpolateInsideCarousel } from '@strv/react-native-hero-carousel'
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated'

const Slide = () => {
  const progress = useInterpolateInsideCarousel({
    valueBefore: 0, // Value for slides before current
    thisValue: 1, // Value for current slide
    valueAfter: 0, // Value for slides after current
    offset: 0.2, // Animation offset (optional)
  })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [
        {
          scale: interpolate(progress.value, [0, 1], [0.8, 1], Extrapolation.CLAMP),
        },
      ],
    }
  })

  return <Animated.View style={animatedStyle}>{/* Your content */}</Animated.View>
}
```

**Returns:**

A `SharedValue` (from `useDerivedValue`) representing the interpolated progress value (0-1) based on the current slide's position in the carousel. Access the value using `.value` in animated styles or worklet functions.

**Parameters:**

| Parameter     | Type     | Default  | Description                                                      |
| ------------- | -------- | -------- | ---------------------------------------------------------------- |
| `valueBefore` | `number` | Required | Value to use for slides before the current slide                 |
| `thisValue`   | `number` | Required | Value to use for the current slide                               |
| `valueAfter`  | `number` | Required | Value to use for slides after the current slide                  |
| `offset`      | `number` | `0`      | Animation offset (0-1) to control when the animation starts/ends |

**Note:** The `interpolateInsideCarousel` utility function is now internal-only. Use this hook instead for all custom animations. The hook automatically handles the slide context (index, total, scrollValue) internally.

## Examples

We provide a comprehensive example app showcasing all the carousel features. You can run the examples locally or view the source code:

### 🏃‍♂️ Running the Example App

```bash
cd example
yarn install
yarn start
```

Then scan the QR code with Expo Go or run on simulator. See the [example app README](./example/README.md) for detailed setup instructions.

### 📱 Available Examples

| Example                | Description                                                          | Source Code                                                                       |
| ---------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Basic Carousel**     | Simple auto-scrolling image carousel                                 | [`BasicExample.tsx`](./example/examples/BasicExample.tsx)                         |
| **Animated Carousel**  | Custom animations with scale, rotation, and opacity                  | [`AnimatedExample.tsx`](./example/examples/AnimatedExample.tsx)                   |
| **Video Carousel**     | Video playback with play/pause controls                              | [`VideoCarouselExample.tsx`](./example/examples/VideoCarouselExample.tsx)         |
| **Timer Pagination**   | Visual progress indicators with custom intervals                     | [`TimerPaginationExample.tsx`](./example/examples/TimerPaginationExample.tsx)     |
| **Entering Animation** | Advanced slide entrance animations using `HeroCarousel.AnimatedView` | [`EnteringAnimationExample.tsx`](./example/examples/EnteringAnimationExample.tsx) |
| **Offset Example**     | Custom slide positioning and spacing                                 | [`OffsetExample.tsx`](./example/examples/OffsetExample.tsx)                       |

### 🎯 Key Example Features

- **Image Carousels** with smooth transitions and auto-scrolling
- **Video Integration** with `expo-video` and playback controls
- **Custom Animations** using `useInterpolateInsideCarousel` hook
- **Entering/Exiting Animations** using `HeroCarousel.AnimatedView` component
- **Timer-based Pagination** with visual progress bars
- **Gesture Handling** with swipe navigation and user interaction detection
- **Performance Optimization** with image preloading and memoization
- **Compound Pattern** - All examples use `HeroCarousel.Provider` for configuration

### 📍 Pagination Examples

The library includes several pagination components and examples:

- **Basic Pagination** - Simple dot indicators showing current slide ([`Pagination.tsx`](./example/examples/components/Pagination.tsx))
- **Timer Pagination** - Animated progress bars with customizable intervals ([`TimerPagination.tsx`](./example/examples/components/TimerPagination.tsx))
- **Custom Pagination** - Build your own pagination using `useCarouselContext()` hook for access to `scrollValue` and `timeoutValue`

All pagination components automatically sync with the carousel state and support:

- ✅ **Real-time updates** as slides change
- ✅ **Timer progress visualization** with animated fill
- ✅ **User interaction detection** (pause on touch)
- ✅ **Custom styling** and animations

## Advanced Usage

### Configuration Examples

Different carousel configurations using the compound pattern:

```tsx
// Basic auto-scrolling carousel
<HeroCarousel.Provider interval={3000}>
  <HeroCarousel>{slides}</HeroCarousel>
</HeroCarousel.Provider>

// Video carousel without auto-scroll
<HeroCarousel.Provider disableAutoScroll>
  <HeroCarousel>{videoSlides}</HeroCarousel>
</HeroCarousel.Provider>

// Carousel with custom intervals per slide
<HeroCarousel.Provider interval={(index) => (index + 1) * 2000}>
  <HeroCarousel>{slides}</HeroCarousel>
</HeroCarousel.Provider>

// Carousel starting from specific slide
<HeroCarousel.Provider initialIndex={2} disableInfiniteScroll>
  <HeroCarousel>{slides}</HeroCarousel>
</HeroCarousel.Provider>

// Custom slide width and animation
<HeroCarousel.Provider
  slideWidth={300}
  autoScrollAnimation={(to, duration) => withSpring(to, { damping: 15 })}
>
  <HeroCarousel>{slides}</HeroCarousel>
</HeroCarousel.Provider>
```

### Using HeroCarousel.AnimatedView

The `HeroCarousel.AnimatedView` component automatically handles entering/exiting animations based on carousel scroll position. Perfect for creating slide-specific animations:

```tsx
import { HeroCarousel } from '@strv/react-native-hero-carousel'
import { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated'

const Slide = ({ title, image }: { title: string; image: string }) => (
  <View style={styles.slide}>
    <Image source={{ uri: image }} style={styles.image} />

    {/* Content that animates when slide becomes active */}
    <HeroCarousel.AnimatedView
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(300)}
      style={styles.content}
    >
      <Text style={styles.title}>{title}</Text>
    </HeroCarousel.AnimatedView>

    {/* Multiple animated views with different timings */}
    <HeroCarousel.AnimatedView
      entering={SlideInDown.duration(500).delay(200)}
      style={styles.subtitle}
    >
      <Text>Subtitle with delay</Text>
    </HeroCarousel.AnimatedView>
  </View>
)

// Usage
<HeroCarousel.Provider>
  <HeroCarousel>
    {slides.map((slide) => (
      <Slide key={slide.id} {...slide} />
    ))}
  </HeroCarousel>
</HeroCarousel.Provider>
```

**Key Features:**

- Automatically triggers entering animation when slide becomes active
- Triggers exiting animation when slide leaves view
- Supports all Reanimated entering/exiting animations
- Configurable thresholds for animation timing
- Can keep content visible after exiting animation

### Programmatic Navigation

Control the carousel programmatically using the context:

```tsx
const CarouselWithControls = () => {
  const { scrollValue, goToPage } = useCarouselContext()
  const { runAutoScroll } = useAutoCarouselSlideIndex()

  const goToNext = () => {
    runAutoScroll(0) // Immediate transition
  }

  const goToSlide = (slideIndex: number) => {
    goToPage(slideIndex, 500) // Go to slide with 500ms animation
  }

  return (
    <HeroCarousel.Provider disableAutoScroll>
      <View>
        <HeroCarousel>{/* Your slides */}</HeroCarousel>

        <View style={styles.controls}>
          <Button title="Previous" onPress={() => goToSlide(scrollValue.value - 1)} />
          <Button title="Next" onPress={goToNext} />
        </View>
      </View>
    </HeroCarousel.Provider>
  )
}
```

## Performance Tips

1. **Image Optimization**: Use optimized image formats and appropriate resolutions
2. **Preloading**: Preload images/videos for smoother transitions
3. **Memoization**: Wrap slide components in `React.memo()` when possible
4. **Worklet Functions**: Keep animations in worklet functions for 60fps performance

```tsx
// Good: Memoized slide component
const SlideComponent = React.memo(({ data }) => {
  // Your slide content
})

// Good: Preload images
useEffect(() => {
  images.forEach((uri) => Image.prefetch(uri))
}, [])
```

## Architecture

### Compound Pattern

This library uses a **compound component pattern** that provides a clean, intuitive API:

```tsx
<HeroCarousel.Provider>
  <HeroCarousel>
    <HeroCarousel.Item>
      <HeroCarousel.AnimatedView>{/* Your content */}</HeroCarousel.AnimatedView>
    </HeroCarousel.Item>
  </HeroCarousel>
</HeroCarousel.Provider>
```

### Context-Based Configuration

All carousel configuration is passed to the `HeroCarousel.Provider` rather than individual components. This design provides several benefits:

✅ **Centralized Configuration** - All settings in one place  
✅ **Cleaner Component API** - Components focus on rendering, not configuration  
✅ **Easier Testing** - Mock context for isolated component testing  
✅ **Flexible Composition** - Components like pagination can be placed anywhere within the provider

The compound pattern allows for:

- **Intuitive API** - Related components are grouped under `HeroCarousel.*`
- **Better Discoverability** - All carousel-related components are accessible via autocomplete
- **Flexible Usage** - Use `HeroCarousel.Item` and `HeroCarousel.AnimatedView` when needed, or pass children directly to `HeroCarousel`

## Troubleshooting

### Common Issues

**Carousel not auto-scrolling:**

- Ensure `HeroCarousel.Provider` wraps your carousel
- Check if `disableAutoScroll` is set to `false`
- Verify React Native Reanimated is properly installed

**Animations not smooth:**

- Make sure animations are running in worklet functions
- Use `runOnUI` for heavy computations
- Avoid heavy operations in animation callbacks

**Infinite scroll not working:**

- Ensure you have at least 2 slides
- Check if slide widths are properly configured

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our GitHub repository.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Built with ❤️ using:

- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) for animations
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) for gestures

---

Made by [STRV](https://www.strv.com) 🚀
