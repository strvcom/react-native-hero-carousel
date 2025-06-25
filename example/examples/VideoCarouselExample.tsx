import {
  AutoCarousel,
  CarouselContextProvider,
  useAutoCarouselSlideIndex,
} from '@strv/react-native-hero-carousel'
import { SafeAreaView, StyleSheet, View, Text, Pressable } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import { LinearGradient } from 'expo-linear-gradient'
import { useActiveSlideEffect, useIsActiveSlide } from '@/hooks/useActiveSlideEffect'
import { useEffect, useRef, useState } from 'react'
import { TimerPagination } from './components/TimerPagination'
import { useEvent, useEventListener } from 'expo'

// Sample video URLs - these are publicly available videos that work well for testing
const videos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
]

const videoTitles = [
  'Big Buck Bunny',
  'Elephants Dream',
  'For Bigger Blazes',
  'For Bigger Escapes',
  'For Bigger Fun',
]

const Slide = ({ videoUri, title, index }: { videoUri: string; title: string; index: number }) => {
  const player = useVideoPlayer(videoUri)
  const { runAutoScroll } = useAutoCarouselSlideIndex()
  const isActiveSlide = useIsActiveSlide()
  const [duration, setDuration] = useState(0)
  useActiveSlideEffect(() => {
    player.currentTime = 0
    player.play()
    return () => {
      player.pause()
    }
  })

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing })

  useEventListener(player, 'statusChange', ({ status }) => {
    if (status === 'readyToPlay') {
      setDuration(player.duration)
    }
  })

  const intervalRef = useRef<ReturnType<typeof runAutoScroll> | null>(null)

  useEffect(() => {
    if (isActiveSlide && duration) {
      intervalRef.current = runAutoScroll(duration * 1000)
    }
  }, [isActiveSlide, duration, runAutoScroll])

  return (
    <Pressable
      key={index}
      style={styles.slide}
      onPress={() => {
        if (isPlaying) {
          player.pause()
          intervalRef.current?.pause()
        } else {
          player.play()
          intervalRef.current?.resume()
        }
      }}
    >
      <VideoView player={player} style={styles.video} contentFit="cover" nativeControls={false} />
      <LinearGradient colors={['rgba(0,0,0,0.8)', 'transparent']} style={styles.topGradient} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Swipe to navigate • Tap to play/pause</Text>
      </LinearGradient>
    </Pressable>
  )
}

export default function VideoCarouselExample() {
  return (
    <CarouselContextProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <AutoCarousel disableAutoScroll={true}>
            {videos.map((video, index) => (
              <Slide key={index} videoUri={video} title={videoTitles[index]} index={index} />
            ))}
          </AutoCarousel>
          <TimerPagination total={videos.length} hideProgressOnInteraction={false} />
        </View>
      </SafeAreaView>
    </CarouselContextProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '20%',
  },
  title: {
    fontSize: 32,
    bottom: 60,
    left: 20,
    position: 'absolute',
    lineHeight: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    bottom: 20,
    left: 20,
    position: 'absolute',
    lineHeight: 20,
    color: 'white',
    opacity: 0.8,
  },
})
