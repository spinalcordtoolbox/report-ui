import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { flexRender, getFilteredRowModel, Updater } from '@tanstack/react-table'
import {
  ColumnDef,
  ColumnOrderState,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useDebounce } from '@uidotdev/usehooks'

import { Dataset } from '@/App'
import ColumnSelect from '@/components/ColumnSelect'
import SearchBox from '@/components/SearchBox'
import Loading from '@/components/Loading'
import useTableLocalStorage from '@/components/Table/useTableLocalStorage'

import {
  TableState,
  ColumnVisibility,
  RowOrder,
  RowFilter,
} from '@/components/Table/types'

export type { TableState } from '@/components/Table/types'

const defaultColumns: ColumnDef<Dataset>[] = [
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

interface TableData extends Dataset {
  position: number
}

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

export type PropTypes = {
  datasets: Dataset[]
  selectedId: string | undefined
  initialTableState: TableState | null
  onSelectRow: (id: string) => any
  sorting: SortingState
  onChangeSorting: React.Dispatch<React.SetStateAction<SortingState>>
  searchRef: React.RefObject<any>
}

function Table({
  datasets,
  selectedId,
  initialTableState,
  onSelectRow,
  sorting,
  onChangeSorting,
  searchRef
}: PropTypes, tbodyRef: React.ForwardedRef<HTMLTableSectionElement>) {
  // for datatable type
  const [columns] = useState([...defaultColumns])
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(
    initialTableState?.columnVisibility || DEFAULT_COLUMN_VISIBILITY,
  )
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    initialTableState?.columnOrder || [],
  )
  const [rowOrder, setRowOrder] = useState<RowOrder>(
    initialTableState?.rowOrder || {},
  )
  const [rowFilter, setRowFilter] = useState<RowFilter>(
    initialTableState?.rowFilter || '',
  )

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
    }: TableState) => {
      setColumnOrder(columnOrder)
      onChangeSorting(sorting)
      setRowOrder(rowOrder)
      setRowFilter(rowFilter)
      setColumnVisibility(columnVisibility)
    },
    [
      setColumnOrder,
      onChangeSorting,
      setRowOrder,
      setRowFilter,
      setColumnVisibility,
    ],
  )

  const localStorageLoaded = useTableLocalStorage(
    tableState,
    initialTableState,
    setTableState,
    DEFAULT_COLUMN_VISIBILITY,
  )

  const sortByColumns = useCallback(
    (sortingState: Updater<SortingState>) => {
      onChangeSorting(sortingState)
    },
    [onChangeSorting],
  )

  const tableData: TableData[] = useMemo(
    () =>
      datasets.map((dataset) => ({
        ...dataset,
        position: rowOrder[dataset.id],
      })),
    [datasets, rowOrder],
  )

  const dataTable = useReactTable<Dataset>({
    data: tableData,
    columns,
    defaultColumn: {
      minSize: 20,
      maxSize: 400,
    },
    state: {
      columnVisibility: {
        ...columnVisibility,
        position: false,
      },
      columnOrder,
      sorting,
      globalFilter: rowFilter,
    },
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility as any,
    onColumnOrderChange: setColumnOrder,
    onSortingChange: sortByColumns,
    getRowId: (row) => row.id,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
  })

  const { rows } = dataTable.getRowModel()

  useEffect(() => {
    const newRowOrder = rows.reduce(
      (memo, row, index) => ({
        ...memo,
        [row.id]: index,
      }),
      {},
    )

    if (JSON.stringify(rowOrder) === JSON.stringify(newRowOrder)) return

    setRowOrder(newRowOrder)
  }, [rows, rowOrder])

  const leafColumns = dataTable.getLeftLeafColumns()

  const columnSizes = useMemo(
    () => leafColumns.map((c) => c.getSize()),
    [leafColumns],
  )

  const [searchString, setSearchString] = useState('')
  const steadySearchString = useDebounce(searchString, 300)

  useEffect(() => {
    setRowFilter(steadySearchString)
  }, [steadySearchString])

  if (!localStorageLoaded && !initialTableState) {
    return (
      <div className="self-center mt-20">
        <Loading />
      </div>
    )
  }

  return (
    <>
      <div className="w-full flex flex-row justify-between">
        <ColumnSelect
          onChange={() => {}}
          columns={dataTable.getAllLeafColumns()}
        />
        <SearchBox
          ref={searchRef}
          value={searchString}
          onChange={setSearchString}
        />
      </div>
      <div className="overflow-y-scroll w-full overflow-x-scroll">
        <table className="min-w-full border-1 border-gray-200 rounded-sm text-[10px] border-spacing-0 border-separate flex-1">
          <thead className="rounded-sm">
            {dataTable.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="sticky top-0 bg-gray-300 text-left"
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    <div
                      className={classNames(
                        'h-full relative p-2 py-3 flex flex-row flex-nowrap items-center',
                        'cursor-pointer hover:bg-gray-50/50 transition-colors select-none',
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      onDoubleClick={() => header.column.resetSize()}
                    >
                      <span>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </span>
                      <div className={'h-full p-2 relative'}>
                        <span className="absolute -top-1 right-0 text-sm font-bold">
                          {{
                            asc: '↑',
                            desc: '↓',
                          }[header.column.getIsSorted() as string] ?? ' '}
                        </span>
                      </div>
                      <div
                        className={classNames(
                          'absolute h-full w-6 right-0 text-lg text-gray-700/50 cursor-col-resize bg-gray-200/20',
                          'opacity-0 hover:opacity-90 active:opacity-100 transition-opacity',
                        )}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2">
                          ↔
                        </div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {rows.length ? null : (
            <caption className="caption-bottom text-center p-2 opacity-80 text-sm">
              {rowFilter.length
                ? 'No results match that search'
                : 'No data loaded'}
            </caption>
          )}
          <tbody ref={tbodyRef}>
            {rows.map((row, i) => (
              <tr
                key={row.id}
                id={row.id}
                tabIndex={0}
                onFocus={() => onSelectRow(row.id)}
                onClick={() => onSelectRow(row.id)}
                className={classNames("focus:bg-gray-300", row.id === selectedId ? "bg-gray-300" : null)}
                autoFocus={i === 0}
              >
                {row.getVisibleCells().map((cell, i) => (
                  <td
                    key={cell.id}
                    className="p-2 border-gray-200 border-1 text-wrap overflow-hidden min-w-4 break-words"
                    style={{
                      maxWidth: Math.min(columnSizes[i], 400) || 400,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default forwardRef(Table)
