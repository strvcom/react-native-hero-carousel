import { Stack } from 'expo-router'

export default function ExamplesLayout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: 'transparent' } }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="basic"
        options={{
          title: 'Basic Carousel',
        }}
      />
      <Stack.Screen
        name="animated"
        options={{
          title: 'Animated Carousel',
        }}
      />
      <Stack.Screen
        name="pagination"
        options={{
          title: 'Custom Pagination',
        }}
      />
    </Stack>
  )
}
