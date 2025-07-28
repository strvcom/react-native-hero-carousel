# React Native Hero Carousel - Example App

This example app demonstrates all the features and capabilities of the `@strv/react-native-hero-carousel` library. It's built with [Expo](https://expo.dev) and showcases various carousel implementations, from basic auto-scrolling carousels to advanced video carousels with custom animations.

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (recommended) or npm/yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (macOS) or Android Emulator

### Installation

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start the development server**

   ```bash
   pnpm start
   ```

3. **Run on your preferred platform**

   - **iOS Simulator**: Press `i` in the terminal or scan QR with Expo Go
   - **Android Emulator**: Press `a` in the terminal or scan QR with Expo Go
   - **Physical Device**: Install [Expo Go](https://expo.dev/go) and scan the QR code

## 📱 Available Examples

The app includes a comprehensive set of examples demonstrating different carousel use cases:

### Core Examples

| Example                                                           | Features                                               | Best For                                  |
| ----------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------- |
| [**Basic Carousel**](./examples/BasicExample.tsx)                 | Auto-scrolling, infinite loop, image preloading        | Simple hero sections, product showcases   |
| [**Animated Carousel**](./examples/AnimatedExample.tsx)           | Custom transitions, scale/rotation effects, pagination | Interactive galleries, feature highlights |
| [**Video Carousel**](./examples/VideoCarouselExample.tsx)         | Video playback, play/pause controls, duration sync     | Video showcases, tutorials, media content |
| [**Timer Pagination**](./examples/TimerPaginationExample.tsx)     | Custom intervals per slide, visual progress            | Announcements, promotional content        |
| [**Entering Animation**](./examples/EnteringAnimationExample.tsx) | Advanced slide entrance effects                        | Product launches, storytelling            |
| [**Offset Example**](./examples/OffsetExample.tsx)                | Custom slide spacing and positioning                   | Card layouts, content previews            |

### Pagination Components

| Component                                                         | Description            | Use Case                       |
| ----------------------------------------------------------------- | ---------------------- | ------------------------------ |
| [**Basic Pagination**](./examples/components/Pagination.tsx)      | Simple dot indicators  | Standard navigation indicators |
| [**Timer Pagination**](./examples/components/TimerPagination.tsx) | Animated progress bars | Visual timing feedback         |

## 🎯 Key Features Demonstrated

### 🎬 **Video Integration**

- Seamless video playback with `expo-video`
- Auto-scroll synced with video duration
- Play/pause controls with gesture support
- Background video management

### 🎨 **Custom Animations**

- Scale, rotation, and opacity transitions
- Parallax effects using `interpolateInsideCarousel`
- Entrance animations for slides
- Smooth gesture-based navigation

### ⏱️ **Timer Controls**

- Dynamic intervals per slide
- Visual progress indicators
- Pause/resume on user interaction
- Custom timing functions

### 📊 **Performance Optimization**

- Image preloading for smooth transitions
- Memoized components for better performance
- Efficient gesture handling
- Worklet-based animations for 60fps

## 🛠️ Development

### Project Structure

```
example/
├── app/                          # App router configuration
│   ├── (examples)/              # Example screens
│   │   ├── basic.tsx           # Basic carousel route
│   │   ├── animated.tsx        # Animated carousel route
│   │   ├── video-carousel.tsx  # Video carousel route
│   │   └── ...                 # Other example routes
│   └── _layout.tsx             # Root layout
├── examples/                    # Example implementations
│   ├── BasicExample.tsx        # Basic carousel implementation
│   ├── AnimatedExample.tsx     # Animated carousel with custom transitions
│   ├── VideoCarouselExample.tsx # Video carousel implementation
│   ├── components/             # Reusable example components
│   │   ├── Pagination.tsx      # Basic pagination component
│   │   └── TimerPagination.tsx # Timer pagination component
│   └── utils.ts               # Shared utilities
└── hooks/                      # Custom hooks for examples
    └── useActiveSlideEffect.ts # Hook for managing active slide effects
```

### Adding New Examples

1. **Create the example component** in `examples/YourExample.tsx`
2. **Add a route** in `app/(examples)/your-example.tsx`
3. **Update the navigation** in `app/(examples)/_layout.tsx`
4. **Test on multiple platforms** (iOS, Android, Web)

Example template:

```tsx
// examples/YourExample.tsx
import { HeroCarousel, CarouselContextProvider } from '@strv/react-native-hero-carousel'

export default function YourExample() {
  return (
    <CarouselContextProvider interval={3000} disableAutoScroll={false} initialIndex={0}>
      <HeroCarousel>{/* Your slides */}</HeroCarousel>
    </CarouselContextProvider>
  )
}
```

### Custom Hooks

The example app includes custom hooks that you can reference:

- **`useActiveSlideEffect`** - Manage side effects when slides become active/inactive
- **`useIsActiveSlide`** - Determine if the current slide is active
- **`useColorScheme`** - Handle light/dark theme switching

## 🧪 Testing

### Manual Testing Checklist

- [ ] **Smooth scrolling** on all platforms
- [ ] **Auto-scroll timing** is consistent
- [ ] **User interaction** properly pauses auto-scroll
- [ ] **Video playback** works correctly
- [ ] **Pagination indicators** update in real-time
- [ ] **Performance** is smooth (60fps animations)
- [ ] **Memory usage** is reasonable (no leaks)

### Performance Testing

1. **Profile with Flipper** - Monitor frame rates and memory usage
2. **Test on low-end devices** - Ensure smooth performance
3. **Memory profiling** - Check for memory leaks with video content

## 🚨 Troubleshooting

### Common Issues

**Metro bundler issues:**

```bash
pnpm start --clear-cache
```

**iOS build issues:**

```bash
cd ios && pod install && cd ..
```

**Android build issues:**

```bash
pnpm android --clear
```

**Video not playing:**

- Check network connection
- Verify video URLs are accessible
- Ensure `expo-video` is properly configured

### Performance Issues

- **Reduce image sizes** if scrolling is choppy
- **Enable Hermes** for better JavaScript performance
- **Use development builds** instead of Expo Go for better performance
- **Profile with React DevTools** to identify bottlenecks

## 📚 Learn More

### Library Documentation

- [Main README](../README.md) - Complete API documentation
- [Source Code](../src/) - Library implementation details

### Expo Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Expo Video](https://docs.expo.dev/versions/latest/sdk/video/)

## 🤝 Contributing

Found a bug or want to add a new example? Contributions are welcome!

1. **Fork the repository**
2. **Create a feature branch**
3. **Add your example or fix**
4. **Test on multiple platforms**
5. **Submit a pull request**

## 📄 License

This example app is part of the `@strv/react-native-hero-carousel` library and is licensed under the MIT License.

---

Made with ❤️ by [STRV](https://www.strv.com) 🚀
