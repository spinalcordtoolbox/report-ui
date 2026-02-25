import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { flexRender, getFilteredRowModel, Updater } from '@tanstack/react-table'
import {
  ColumnOrderState,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useDebounce } from '@uidotdev/usehooks'

import { Dataset } from '@/components/Datasets'
import ColumnSelect from '@/components/ColumnSelect'
import SearchBox from '@/components/SearchBox'
import Loading from '@/components/Loading'

import {
  TableState,
  ColumnVisibility,
  RowFilter,
} from '@/components/Table/types'
import { defaultColumns, TableStateUpdateFn } from '@/lib/hooks/useTableState'
import TableBody from './TableBody'
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts'
import { replaceDatasetState } from '@/util/replace'

export type { TableState } from '@/components/Table/types'

export type PropTypes = {
  datasets: Dataset[]
  onChangeDatasets: React.Dispatch<React.SetStateAction<Dataset[]>>
  selectedId: string | undefined
  tableState: TableState
  onChangeTableState: TableStateUpdateFn
  isLoading: boolean
  onSelectRow: (id: string) => any
  onToggleImageFit: () => void
  onToggleShowOverlay: () => void
}

function Table({
  datasets,
  onChangeDatasets,
  selectedId,
  onSelectRow,
  tableState,
  onChangeTableState,
  isLoading,
  onToggleImageFit,
  onToggleShowOverlay,
}: PropTypes) {
  const { columnOrder, columnVisibility, rowFilter, sorting } = tableState

  const [columns] = useState([...defaultColumns])

  const [manualSort, setManualSort] = useState(true)

  const sortByColumns = useCallback((sortingState: Updater<SortingState>) => {
    setManualSort(false)
    onChangeTableState({ sorting: sortingState })
  }, [])

  const setColumnVisibility = useCallback(
    (cv: SetStateAction<ColumnVisibility>) =>
      onChangeTableState({ columnVisibility: cv }),
    [],
  )

  const setColumnOrder = useCallback(
    (co: SetStateAction<ColumnOrderState>) =>
      onChangeTableState({ columnOrder: co }),
    [],
  )

  const setRowFilter = useCallback(
    (rf: SetStateAction<RowFilter>) => onChangeTableState({ rowFilter: rf }),
    [],
  )

  const dataTable = useReactTable<Dataset>({
    data: datasets,
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
    manualSorting: manualSort,
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

  const changeDataset = useCallback(
    (id: string, replaceDataset: Partial<Dataset>) => {
      /*
       * Freeze order when modifying data to prevent losing one's place on the list.
       * To achieve this, we switch to manualSorting, using the current sorted
       * rows from getSortedRowModel as our ordered list
       */
      if (tableState.sorting.length > 0) {
        const { rows: sortedRows } = dataTable.getSortedRowModel()

        /*
         * This is a little tricky: replaceDatasetState returns an updater function,
         * which takes an array of datasets and replaces a single one, and
         * which we want to run on the *sorted* rows
         */
        setManualSort(true)
        onChangeTableState({ sorting: [] })
        onChangeDatasets(
          replaceDatasetState(
            id,
            replaceDataset,
          )(sortedRows.map((r) => r.original)),
        )

        return
      }

      onChangeDatasets(replaceDatasetState(id, replaceDataset))
    },
    [JSON.stringify(tableState.sorting)],
  )

  const searchRef = useRef<HTMLInputElement>(null)

  const focusSearch = useCallback(() => {
    if (!searchRef.current) {
      return
    }

    searchRef.current.focus()
  }, [searchRef.current])

  const tbodyRef = useRef<HTMLTableSectionElement>(null)

  useKeyboardShortcuts(
    datasets,
    changeDataset,
    tbodyRef,
    onToggleImageFit,
    onToggleShowOverlay,
    selectedId,
    onSelectRow,
    focusSearch,
  )

  const [searchString, setSearchString] = useState('')
  const steadySearchString = useDebounce(searchString, 300)

  useEffect(() => {
    setRowFilter(steadySearchString)
  }, [steadySearchString])

  const containerRef = useRef<HTMLDivElement>(null)

  if (isLoading) {
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
      <div
        ref={containerRef}
        className="w-full h-[480px] relative overflow-auto flex-grow-1"
      >
        <table className="min-w-full rounded-sm text-[10px] grid flex-1">
          <thead className="rounded-sm grid sticky top-0 z-10">
            {dataTable.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="flex bg-gray-300 text-left"
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    <div
                      className={classNames(
                        'h-full w-full relative p-2 py-3 flex flex-row flex-nowrap items-center',
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
          <TableBody
            ref={tbodyRef}
            table={dataTable}
            tableContainerRef={containerRef}
            selectedId={selectedId}
            onSelectRow={onSelectRow}
          />
        </table>
      </div>
    </>
  )
}

export default Table
