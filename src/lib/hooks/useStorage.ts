import { useEffect, useState } from 'react'
import { get, set } from 'idb-keyval'

/* key must not change throughout the usage of this hook */
export function useStorage<T>(
  key: string,
  initialValue: T,
): [boolean, T, React.Dispatch<React.SetStateAction<T>>] {
  const [current, setCurrent] = useState(initialValue)
  const [isLoading, setIsLoading] = useState(true)

  // once, on mount, load from DB
  useEffect(() => {
    get(key).then((dbVal) => {
      if (!dbVal) {
        setIsLoading(false)
        return
      }

      setCurrent(dbVal)
      setIsLoading(false)
    })
  }, [])

  const [_savingPromise, setSavingPromise] = useState(Promise.resolve())

  // whenever the value changes, eventually save it to IndexedDB
  useEffect(() => {
    setSavingPromise((p) => p.then(() => set(key, current)))
  }, [current])

  return [isLoading, current, setCurrent]
}
