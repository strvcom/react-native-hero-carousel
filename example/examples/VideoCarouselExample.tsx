import { HeroCarousel, useAutoCarouselSlideIndex } from '@strv/react-native-hero-carousel'
import { SafeAreaView, StyleSheet, View, Text, Pressable, Dimensions, Platform } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import { LinearGradient } from 'expo-linear-gradient'
import { useActiveSlideEffect, useIsActiveSlide } from '@/hooks/useActiveSlideEffect'
import { useEffect, useRef, useState } from 'react'
import { TimerPagination } from './components/TimerPagination'
import { useEvent, useEventListener } from 'expo'

const { width, height } = Dimensions.get('window')
// Sample video URLs - these are publicly available videos that work well for testing
const videos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
]

const videoTitles = [
  'For Bigger Blazes',
  'For Bigger Escapes',
  'For Bigger Fun',
  'Big Buck Bunny',
  'Elephants Dream',
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
    <View style={styles.slide}>
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
        <VideoView
          player={player}
          style={styles.video}
          contentFit={Platform.OS === 'android' ? 'fill' : 'cover'}
          nativeControls={false}
        />
        <LinearGradient colors={['rgba(0,0,0,0.8)', 'transparent']} style={styles.topGradient} />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Swipe to navigate • Tap to play/pause</Text>
        </LinearGradient>
      </Pressable>
    </View>
  )
}

export default function VideoCarouselExample() {
  return (
    <HeroCarousel.Provider disableAutoScroll={true}>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <HeroCarousel>
            {videos.map((video, index) => (
              <Slide key={index} videoUri={video} title={videoTitles[index]} index={index} />
            ))}
          </HeroCarousel>
          <TimerPagination total={videos.length} hideProgressOnInteraction={false} />
        </View>
      </SafeAreaView>
    </HeroCarousel.Provider>
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
    width: width,
    height: height,
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
