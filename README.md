# React Native Hero Carousel

<div style="display: flex; flex-direction: row; gap: 10px;">
<img src="docs/assets/carousel-demo.webp" alt="Carousel Demo" width="200">
<img src="docs/assets/carousel-demo2.webp" alt="Video Carousel Demo" width="200">
<img src="docs/assets/carousel-demo3.webp" alt="Other Carousel Demo" width="200">
</div>
A highly customizable, performant carousel component for React Native with advanced animations, auto-scrolling capabilities, and infinite scrolling support. Built with React Native Reanimated for smooth, native-level performance.

**✨ Context-Based Configuration** - All carousel settings are configured through the context provider for a clean, centralized API.

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
import { HeroCarousel, CarouselContextProvider } from '@strv/react-native-hero-carousel'

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
    <CarouselContextProvider interval={4000} disableAutoScroll={false} initialIndex={0}>
      <View style={styles.container}>
        <HeroCarousel>
          {slides.map((slide) => (
            <Slide key={slide.id} title={slide.title} color={slide.color} />
          ))}
        </HeroCarousel>
      </View>
    </CarouselContextProvider>
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

#### `CarouselContextProvider`

The context provider that must wrap your carousel components. **All carousel configuration is passed here.**

```tsx
<CarouselContextProvider
  initialIndex={0} // Initial slide index (default: 0)
  slideWidth={screenWidth} // Width of each slide (default: screen width)
  interval={3000} // Auto-scroll interval in ms
  disableAutoScroll={false} // Disable auto-scrolling
  disableInfiniteScroll={false} // Disable infinite scrolling
  autoScrollAnimation={(to, duration) => withTiming(to, { duration })} // Custom animation
>
  {children}
</CarouselContextProvider>
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

The main carousel component that renders slides. **Takes no configuration props** - all configuration is handled by the context.

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

#### `useHeroCarouselSlideIndex()`

Get the current slide information and auto-scroll controls.

```tsx
const { index, total, runAutoScroll, goToPage } = useHeroCarouselSlideIndex()
```

**Returns:**

- `index`: Current slide index
- `total`: Total number of slides
- `runAutoScroll`: Function to manually trigger auto-scroll with custom interval
- `goToPage`: Function to programmatically navigate to a specific slide from another slide

### Utilities

#### `interpolateInsideCarousel()`

Advanced interpolation utility for creating custom slide animations.

```tsx
import { interpolateInsideCarousel } from '@strv/react-native-hero-carousel'

const animatedStyle = useAnimatedStyle(() => {
  const progress = interpolateInsideCarousel(scrollValue.value, slideIndex, total, {
    valueBefore: 0, // Value for slides before current
    thisValue: 1, // Value for current slide
    valueAfter: 0, // Value for slides after current
    offset: 0.2, // Animation offset (optional)
  })

  return {
    opacity: progress,
    transform: [{ scale: progress }],
  }
})
```

## Examples

We provide a comprehensive example app showcasing all the carousel features. You can run the examples locally or view the source code:

### 🏃‍♂️ Running the Example App

```bash
cd example
pnpm install
pnpm start
```

Then scan the QR code with Expo Go or run on simulator. See the [example app README](./example/README.md) for detailed setup instructions.

### 📱 Available Examples

| Example                | Description                                         | Source Code                                                                       |
| ---------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Basic Carousel**     | Simple auto-scrolling image carousel                | [`BasicExample.tsx`](./example/examples/BasicExample.tsx)                         |
| **Animated Carousel**  | Custom animations with scale, rotation, and opacity | [`AnimatedExample.tsx`](./example/examples/AnimatedExample.tsx)                   |
| **Video Carousel**     | Video playback with play/pause controls             | [`VideoCarouselExample.tsx`](./example/examples/VideoCarouselExample.tsx)         |
| **Timer Pagination**   | Visual progress indicators with custom intervals    | [`TimerPaginationExample.tsx`](./example/examples/TimerPaginationExample.tsx)     |
| **Entering Animation** | Advanced slide entrance animations                  | [`EnteringAnimationExample.tsx`](./example/examples/EnteringAnimationExample.tsx) |
| **Offset Example**     | Custom slide positioning and spacing                | [`OffsetExample.tsx`](./example/examples/OffsetExample.tsx)                       |

### 🎯 Key Example Features

- **Image Carousels** with smooth transitions and auto-scrolling
- **Video Integration** with `expo-video` and playback controls
- **Custom Animations** using `interpolateInsideCarousel` utility
- **Timer-based Pagination** with visual progress bars
- **Gesture Handling** with swipe navigation and user interaction detection
- **Performance Optimization** with image preloading and memoization

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

Different carousel configurations using the context provider:

```tsx
// Basic auto-scrolling carousel
<CarouselContextProvider interval={3000}>
  <HeroCarousel>{slides}</HeroCarousel>
</CarouselContextProvider>

// Video carousel without auto-scroll
<CarouselContextProvider disableAutoScroll>
  <HeroCarousel>{videoSlides}</HeroCarousel>
</CarouselContextProvider>

// Carousel with custom intervals per slide
<CarouselContextProvider interval={(index) => (index + 1) * 2000}>
  <HeroCarousel>{slides}</HeroCarousel>
</CarouselContextProvider>

// Carousel starting from specific slide
<CarouselContextProvider initialIndex={2} disableInfiniteScroll>
  <HeroCarousel>{slides}</HeroCarousel>
</CarouselContextProvider>

// Custom slide width and animation
<CarouselContextProvider
  slideWidth={300}
  autoScrollAnimation={(to, duration) => withSpring(to, { damping: 15 })}
>
  <HeroCarousel>{slides}</HeroCarousel>
</CarouselContextProvider>
```

### Programmatic Navigation

Control the carousel programmatically using the context:

```tsx
const CarouselWithControls = () => {
  const { scrollValue, goToPage } = useCarouselContext()
  const { runAutoScroll } = useHeroCarouselSlideIndex()

  const goToNext = () => {
    runAutoScroll(0) // Immediate transition
  }

  const goToSlide = (slideIndex: number) => {
    goToPage(slideIndex, 500) // Go to slide with 500ms animation
  }

  return (
    <CarouselContextProvider disableAutoScroll>
      <View>
        <HeroCarousel>{/* Your slides */}</HeroCarousel>

        <View style={styles.controls}>
          <Button title="Previous" onPress={() => goToSlide(scrollValue.value - 1)} />
          <Button title="Next" onPress={goToNext} />
        </View>
      </View>
    </CarouselContextProvider>
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

### Context-Based Configuration

This library uses a **context-based architecture** where all carousel configuration is passed to the `CarouselContextProvider` rather than individual components. This design provides several benefits:

✅ **Centralized Configuration** - All settings in one place  
✅ **Cleaner Component API** - Components focus on rendering, not configuration  
✅ **Easier Testing** - Mock context for isolated component testing

That allows for components like pagination to not be attached to the carousel component.

## Troubleshooting

### Common Issues

**Carousel not auto-scrolling:**

- Ensure `CarouselContextProvider` wraps your carousel
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
