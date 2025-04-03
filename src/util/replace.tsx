import { Dataset } from '@/App'

// replace an object in an immutable array, returning a new array with idx replaced by object
export const replace = <T,>(
  array: Array<T>,
  idx: number,
  object: T,
): Array<T> =>
  array.map((item, i) => {
    if (i === idx) {
      return object
    }

    return item
  })

export function replaceDataset(
  datasets: Dataset[],
  cmdline: string,
  updateArgs: Partial<Dataset>,
): Dataset[] {
  const idx = datasets.findIndex((d) => d.cmdline === cmdline)
  const dataset = datasets[idx]
  return replace(datasets, idx, { ...dataset, ...updateArgs })
}
