// Sometimes the calculation between slide width and scroll offset is not precise
export const customRound = (number: number, precision = 0.003) => {
  'worklet'
  // Find the difference between the number and its nearest integer value
  const rounded = Math.round(number)
  const difference = Math.abs(number - rounded)

  // If the difference is less than or equal to the precision, round the number to the nearest integer
  if (difference <= precision) {
    return Math.round(number)
  }

  // If the difference is greater than the precision, return the original number
  return number
}
