/**
 * Generate an array of integers from the interval [min, max]
 */
const range = ({ min = 1, max }: { min?: number; max: number }) =>
  Array.from({ length: max - min + 1 }, (_, i) => min + i);

export { range };
