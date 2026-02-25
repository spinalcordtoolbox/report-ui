import { Dataset } from '@/components/Datasets'

// replace an object in an immutable array, returning a new array with idx replaced by object
const replace = <T,>(
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

/* Generate an updater function that replaces a single dataset from the state array */
export const replaceDatasetState =
  (id: string, updateArgs: Partial<Dataset>) => (datasets: Dataset[]) => {
    const idx = datasets.findIndex((d) => d.id === id)
    const dataset = datasets[idx]

    return replace(datasets, idx, { ...dataset, ...updateArgs })
  }
