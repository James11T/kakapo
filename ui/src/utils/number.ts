// Generate an array of numbers from min to max
const range = ({ min = 1, max }: { min?: number; max: number }) =>
  Array.from({ length: max - min + 1 }, (_, i) => min + i);

export { range };
