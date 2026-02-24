import {
  forwardRef,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
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
  RowOrder,
  RowFilter,
} from '@/components/Table/types'
import { defaultColumns, TableStateUpdateFn } from '@/lib/hooks/useTableState'
import TableBody from './TableBody'

export type { TableState } from '@/components/Table/types'

interface TableData extends Dataset {
  position: number
}

export type PropTypes = {
  datasets: Dataset[]
  selectedId: string | undefined
  tableState: TableState
  onChangeTableState: TableStateUpdateFn
  isLoading: boolean
  onSelectRow: (id: string) => any
  searchRef: React.RefObject<any>
}

function Table(
  {
    datasets,
    selectedId,
    onSelectRow,
    tableState,
    onChangeTableState,
    isLoading,
    searchRef,
  }: PropTypes,
  tbodyRef: React.ForwardedRef<HTMLTableSectionElement>,
) {
  const { columnOrder, columnVisibility, rowOrder, rowFilter, sorting } =
    tableState

  const [columns] = useState([...defaultColumns])

  const sortByColumns = useCallback((sortingState: Updater<SortingState>) => {
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

  const setRowOrder = useCallback(
    (ro: SetStateAction<RowOrder>) => onChangeTableState({ rowOrder: ro }),
    [],
  )

  const setRowFilter = useCallback(
    (rf: SetStateAction<RowFilter>) => onChangeTableState({ rowFilter: rf }),
    [],
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
    let cancelled = false

    const computeRowOrder = async () => {
      const newRowOrder = rows.reduce(
        (memo, row, index) => ({
          ...memo,
          [row.id]: index,
        }),
        {},
      )

      if (cancelled) return
      if (JSON.stringify(rowOrder) === JSON.stringify(newRowOrder)) return

      setRowOrder(newRowOrder)
    }

    // for some reason the async function was still blocking
    const timer = setTimeout(computeRowOrder, 0)

    return () => {
      clearTimeout(timer)
    }
  }, [rows, rowOrder])

  // const leafColumns = dataTable.getLeftLeafColumns()

  // const columnSizes = useMemo(
  //   () => leafColumns.map((c) => c.getSize()),
  //   [leafColumns],
  // )

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
        className="w-full flex-grow-1 overflow-y-scroll overflow-x-scroll"
      >
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

export default forwardRef(Table)
