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
  TableState,
} from '@/components/Table/types'
import { useStorage } from '@/lib/hooks/useStorage'
import { getConstants } from '@/util/constants'
import { EditableCell } from '@/components/Table/EditableCell'

export const defaultColumns: ColumnDef<Dataset>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    size: 120,
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
    size: 60,
  },
  {
    accessorKey: 'qc',
    header: 'QC',
    size: 60,
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    size: 250,
    minSize: 250,
    cell: EditableCell,
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
  notes: false,
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
    isLoadingRowFilter ||
    isLoadingSorting

  const tableState: TableState = {
    columnOrder,
    columnVisibility,
    sorting,
    rowFilter,
  }

  const setTableState = useCallback(
    ({
      columnOrder,
      columnVisibility,
      sorting,
      rowFilter,
    }: TableStateUpdater) => {
      if (columnOrder !== undefined) {
        setColumnOrder(columnOrder)
      }
      if (sorting !== undefined) {
        setSorting(sorting)
      }
      if (rowFilter !== undefined) {
        setRowFilter(rowFilter)
      }
      if (columnVisibility !== undefined) {
        setColumnVisibility(columnVisibility)
      }
    },
    [setColumnOrder, setSorting, setRowFilter, setColumnVisibility],
  )

  return { isLoading, tableState, setTableState }
}
