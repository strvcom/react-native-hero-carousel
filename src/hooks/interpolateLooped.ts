import { Extrapolation, interpolate } from 'react-native-reanimated'

export const interpolateLooped = (
  value: number,
  index: number,
  totalLength: number,
  values: {
    incoming: number
    inside: number
    outgoing: number
    offset: number
  },
) => {
  'worklet'
  const { offset, incoming, inside, outgoing } = values
  let adjustedIndex = index

  if (index === 0) {
    adjustedIndex = Math.max(totalLength - 2, 0)
  }

  if (index === totalLength - 1) {
    adjustedIndex = 1
  }

  const inputRange = [
    0,
    Math.min(1, adjustedIndex - 1) - offset,
    adjustedIndex - 1 + offset,
    adjustedIndex,
    adjustedIndex + 1 - offset,
    Math.max(totalLength - 2, adjustedIndex + 1) + offset,
    totalLength - 1,
  ]

  const outputValues = [inside, incoming, outgoing, inside, incoming, outgoing, inside]

  return interpolate(value, inputRange, outputValues, Extrapolation.CLAMP)
}
