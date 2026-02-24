import { SetStateAction, useCallback } from 'react'
import {
  ColumnDef,
  ColumnOrderState,
  SortingState,
} from '@tanstack/react-table'

import { Dataset } from '@/components/Datasets'
import {
  ColumnVisibility,
  RowFilter,
  RowOrder,
  TableState,
} from '@/components/Table/types'
import { useStorage } from '@/lib/hooks/useStorage'
import { getConstants } from '@/util/constants'

export const defaultColumns: ColumnDef<Dataset>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'dataset',
    header: 'Dataset',
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
  },
  {
    accessorKey: 'path',
    header: 'Path',
  },
  {
    accessorKey: 'inputFile',
    header: 'File',
  },
  {
    accessorKey: 'contrast',
    header: 'Contrast',
  },
  {
    accessorKey: 'command',
    header: 'Function',
  },
  {
    accessorKey: 'cmdline',
    header: 'Function+Args',
  },
  {
    accessorKey: 'rank',
    header: 'Rank',
  },
  {
    accessorKey: 'qc',
    header: 'QC',
  },
  { accessorKey: 'position', enableHiding: true },
]

const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  date: true,
  dataset: false,
  subject: true,
  path: false,
  inputFile: true,
  contrast: true,
  command: true,
  cmdline: false,
  rank: false,
  qc: true,
}

type TableStateUpdater = Partial<{
  [Property in keyof TableState]: SetStateAction<TableState[Property]>
}>

export type TableStateUpdateFn = (ts: TableStateUpdater) => void

type ReturnType = {
  isLoading: boolean
  tableState: TableState
  setTableState: TableStateUpdateFn
}

export function useTableState(): ReturnType {
  const { TABLE_LOCAL_STORAGE_KEY } = getConstants()
  const [isLoadingColumnVisibility, columnVisibility, setColumnVisibility] =
    useStorage<ColumnVisibility>(
      `${TABLE_LOCAL_STORAGE_KEY}-column-visibility`,
      DEFAULT_COLUMN_VISIBILITY,
    )

  const [isLoadingColumnOrder, columnOrder, setColumnOrder] =
    useStorage<ColumnOrderState>(`${TABLE_LOCAL_STORAGE_KEY}-column-order`, [])

  const [isLoadingRowOrder, rowOrder, setRowOrder] = useStorage<RowOrder>(
    `${TABLE_LOCAL_STORAGE_KEY}-row-order`,
    {},
  )
  const [isLoadingRowFilter, rowFilter, setRowFilter] = useStorage<RowFilter>(
    `${TABLE_LOCAL_STORAGE_KEY}-row-filter`,
    '',
  )

  const [isLoadingSorting, sorting, setSorting] = useStorage<SortingState>(
    `${TABLE_LOCAL_STORAGE_KEY}-sorting`,
    [],
  )

  const isLoading =
    isLoadingColumnVisibility ||
    isLoadingColumnOrder ||
    isLoadingRowOrder ||
    isLoadingRowFilter ||
    isLoadingSorting

  const tableState: TableState = {
    columnOrder,
    columnVisibility,
    sorting,
    rowOrder,
    rowFilter,
  }

  const setTableState = useCallback(
    ({
      columnOrder,
      columnVisibility,
      sorting,
      rowOrder,
      rowFilter,
    }: TableStateUpdater) => {
      if (columnOrder) {
        setColumnOrder(columnOrder)
      }
      if (sorting) {
        setSorting(sorting)
      }
      if (rowOrder) {
        setRowOrder(rowOrder)
      }
      if (rowFilter) {
        setRowFilter(rowFilter)
      }
      if (columnVisibility) {
        setColumnVisibility(columnVisibility)
      }
    },
    [
      setColumnOrder,
      setSorting,
      setRowOrder,
      setRowFilter,
      setColumnVisibility,
    ],
  )

  return { isLoading, tableState, setTableState }
}
