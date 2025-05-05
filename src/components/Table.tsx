import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { useDebounce, useLocalStorage } from '@uidotdev/usehooks'

import { Dataset } from '@/App'
import { getConstants } from '@/util/constants'
import { replaceDataset } from '@/util/replace'
import ColumnSelect from '@/components/ColumnSelect'
import SearchBox from '@/components/SearchBox'
import Loading from '@/components/Loading'

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

type RowOrder = {
  [key: string]: number
}

type RowFilter = string

type ColumnVisibility = {
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

export interface TableState {
  columnOrder: ColumnOrderState
  columnVisibility: ColumnVisibility
  sorting: SortingState
  rowOrder: RowOrder
  rowFilter: RowFilter
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
  initialTableState: TableState | null
  onChangeDatasets: (d: Dataset[]) => any
  onSelectRow: (id: string) => any
  onToggleShowOverlay: () => void
  onToggleImageFit: () => void
}

export function Table({
  datasets,
  initialTableState,
  onChangeDatasets,
  onSelectRow,
  onToggleShowOverlay,
  onToggleImageFit,
}: PropTypes) {
  // for datatable type
  const [columns] = useState([...defaultColumns])
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(
    initialTableState?.columnVisibility || DEFAULT_COLUMN_VISIBILITY,
  )
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    initialTableState?.columnOrder || [],
  )
  const [sorting, setSorting] = useState<SortingState>(
    initialTableState?.sorting || [],
  )
  const [rowOrder, setRowOrder] = useState<RowOrder>(
    initialTableState?.rowOrder || {},
  )
  const [rowFilter, setRowFilter] = useState<RowFilter>(
    initialTableState?.rowFilter || '',
  )

  const [localStorage, setLocalStorage] = useLocalStorage<TableState>(
    getConstants().TABLE_LOCAL_STORAGE_KEY,
    initialTableState || {
      columnOrder: [],
      columnVisibility: DEFAULT_COLUMN_VISIBILITY,
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

    const { columnOrder, columnVisibility, sorting, rowOrder, rowFilter } =
      localStorage

    setColumnOrder(columnOrder)
    setSorting(sorting)
    setRowOrder(rowOrder)
    setRowFilter(rowFilter)
    setColumnVisibility(columnVisibility)

    setLocalStorageLoaded(true)
  }, [])

  /* Update local storage as effect for performance reasons */
  useEffect(() => {
    if (!localStorageLoaded) {
      return
    }

    setLocalStorage({
      columnOrder,
      columnVisibility,
      sorting,
      rowOrder,
      rowFilter,
    })

    /* on unmount, save once more */
    return () => {
      setLocalStorage({
        columnOrder,
        columnVisibility,
        sorting,
        rowOrder,
        rowFilter,
      })
    }
  }, [
    localStorageLoaded,
    columnOrder,
    sorting,
    rowOrder,
    rowFilter,
    columnVisibility,
  ])

  const sortByColumns = useCallback(
    (sortingState: Updater<SortingState>) => {
      setSorting(sortingState)
    },
    [setSorting],
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

  const tbodyRef = useRef<HTMLTableSectionElement>(null)

  // freeze order when modifying data to prevent losing one's place on the list
  const changeDatasets = useCallback((replaceDatasets: Dataset[]) => {
    setSorting([{ id: 'position', desc: false }])

    onChangeDatasets(replaceDatasets)
  }, [])

  const cycleQc = (id: string) => {
    const dataset = datasets.find((d) => d.id === id)
    if (!dataset) {
      console.error(`Dataset not found: ${id}`)
      return
    }

    let nextQc
    switch (dataset.qc) {
      case '':
        nextQc = '✅'
        break
      case '✅':
        nextQc = '❌'
        break
      case '❌':
        nextQc = '⚠️'
        break
      case '⚠️':
        nextQc = ''
        break
      default:
        nextQc = ''
        break
    }

    changeDatasets(replaceDataset(datasets, id, { qc: nextQc }))
  }

  const updateRank = useCallback(
    (id: string, rank: number) => {
      if (!(rank >= 0 && rank <= 9)) {
        console.error(`Invalid rank set for ${id}: ${rank}`)
        return
      }

      changeDatasets(replaceDataset(datasets, id, { rank }))
    },
    [datasets, changeDatasets],
  )

  const keyDebug = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return !!params.get('debug_keys')
  }, [window.location.search])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTableRowElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (!tbodyRef.current) {
        return
      }

      const row = event.currentTarget

      const currentRow = tbodyRef.current.children.namedItem(row.id)

      let sibling

      if (keyDebug) {
        console.log('===== Key event =====')
        console.dir(event.key)
        if (event.key.match(/\d/)) {
          console.log(`${event.key} matches /\\d/`)
        } else {
          console.log(`${event.key} does not match /\\d/`)
        }
        console.log('=====')
      }

      if (event.key.match(/\d/)) {
        updateRank(row.id, parseInt(event.key))
      }

      switch (event.key) {
        case 'f':
        case 'F':
          cycleQc(row.id)
          break
        case 'd':
        case 'D':
          onToggleImageFit()
          break
        case 'ArrowRight':
          onToggleShowOverlay()
          return
        case 'ArrowUp':
          sibling = currentRow?.previousElementSibling
          break
        case 'ArrowDown':
          sibling = currentRow?.nextElementSibling
          break
        default:
          break
      }
      if (!sibling) return
      ;(sibling as any).focus()

      onSelectRow(sibling.id)
    },
    [
      tbodyRef.current,
      cycleQc,
      updateRank,
      onToggleShowOverlay,
      onToggleImageFit,
      keyDebug,
    ],
  )

  useEffect(() => {
    const handleOutsideKeyDown = (e: KeyboardEvent) => {
      if (!tbodyRef.current || tbodyRef.current.children.length === 0) {
        return
      }

      const key = e.key

      if (key !== 'ArrowDown') {
        return
      }

      ;(tbodyRef.current.children[0] as any).focus()
    }
    document.addEventListener('keydown', handleOutsideKeyDown)

    return () => {
      document.removeEventListener('keydown', handleOutsideKeyDown)
    }
  }, [tbodyRef.current])

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
        <SearchBox value={searchString} onChange={setSearchString} />
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
                onKeyDown={handleKeyDown}
                onFocus={() => onSelectRow(row.id)}
                onClick={() => onSelectRow(row.id)}
                className="focus:bg-gray-300"
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
