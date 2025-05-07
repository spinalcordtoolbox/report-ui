import { ColumnOrderState, SortingState } from "@tanstack/react-table"

export type ColumnVisibility = {
  date: boolean
  dataset: boolean
  subject: boolean
  path: boolean
  inputFile: boolean
  contrast: boolean
  command: boolean
  cmdline: boolean
  rank: boolean
  qc: boolean
}

export type RowOrder = {
  [key: string]: number
}

export type RowFilter = string

export interface TableState {
  columnOrder: ColumnOrderState
  columnVisibility: ColumnVisibility
  sorting: SortingState
  rowOrder: RowOrder
  rowFilter: RowFilter
}
