import { useEffect, useState } from 'react'
import { useLocalStorage } from '@uidotdev/usehooks'

import { getConstants } from '@/util/constants'
import { TableState, ColumnVisibility } from '@/components/Table/types'

export default function useTableLocalStorage(
  tableState: TableState,
  initialTableState: TableState | null,
  setTableState: (t: TableState) => any,
  defaultColumnVisibility: ColumnVisibility): boolean {

  const [localStorage, setLocalStorage] = useLocalStorage<TableState>(
    getConstants().TABLE_LOCAL_STORAGE_KEY,
    initialTableState || {
      columnOrder: [],
      columnVisibility: defaultColumnVisibility,
      sorting: [],
      rowOrder: {},
      rowFilter: '',
    },
  )

  const [localStorageLoaded, setLocalStorageLoaded] = useState(false)

  /* Once, at mount, load from local storage */
  useEffect(() => {
    /* Table state was loaded from file, overwrite */
    if (initialTableState) {
      setLocalStorage(initialTableState)
      setLocalStorageLoaded(true)
      return
    }

    setTableState(localStorage)

    setLocalStorageLoaded(true)
  }, [])

  /* Update local storage as effect for performance reasons */
  useEffect(() => {
    if (!localStorageLoaded) {
      return
    }

    setLocalStorage(tableState)

    /* on unmount, save once more */
    return () => {
      setLocalStorage(tableState)
    }
  }, [
    localStorageLoaded,
    JSON.stringify(tableState)
  ])

  return localStorageLoaded
}
