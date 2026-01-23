import { useState } from 'react'
import { SortingState } from '@tanstack/react-table'

import {
  TableState,
} from '@/components/Table/types'

export function useTableState(initialTableState: TableState | null) {
  const [sorting, setSorting] = useState<SortingState>(
    initialTableState?.sorting || [],
  )

  return {
    sorting,
    setSorting
  }
}
