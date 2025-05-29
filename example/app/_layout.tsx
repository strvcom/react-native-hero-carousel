import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context'
import * as SystemUI from 'expo-system-ui'
import { DarkTheme, ThemeProvider } from '@react-navigation/native'

SystemUI.setBackgroundColorAsync('black')

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider value={DarkTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
        </GestureHandlerRootView>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
