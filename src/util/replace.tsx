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
