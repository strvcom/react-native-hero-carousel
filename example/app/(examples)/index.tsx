import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
const examples = [
  {
    title: 'Basic Carousel',
    description: 'A simple carousel with basic animations and pagination',
    route: '/basic' as const,
  },
  {
    title: 'Animated Carousel',
    description: 'Advanced animations with custom transitions',
    route: '/animated' as const,
  },
  {
    title: 'Offset Carousel',
    description: 'A carousel with offset animations',
    route: '/offset' as const,
  },
  {
    title: 'Entering Animation Carousel',
    description: 'Carousel with entering/exiting animations triggered by shared values',
    route: '/entering-animation' as const,
  },
  {
    title: 'Instagram Pagination',
    description: 'Instagram-style pagination with auto-slide progress indicator',
    route: '/instagram-pagination' as const,
  },
  {
    title: 'Video Carousel',
    description: 'A carousel showcasing videos using expo-video',
    route: '/video-carousel' as const,
  },
]

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Carousel Examples
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Select an example to view
        </ThemedText>
        <ScrollView style={styles.scrollView}>
          {examples.map((example) => (
            <Link key={example.route} href={example.route} asChild push>
              <TouchableOpacity style={styles.card}>
                <ThemedText style={styles.cardTitle}>{example.title}</ThemedText>
                <ThemedText style={styles.cardDescription}>{example.description}</ThemedText>
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
})
