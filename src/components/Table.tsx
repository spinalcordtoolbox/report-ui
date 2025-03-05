import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { flexRender } from '@tanstack/react-table'
import {
  ColumnDef,
  ColumnOrderState,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'

import { Dataset } from 'App'
import { replace } from 'util/replace'
import ColumnSelect from './ColumnSelect'

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
]

export type PropTypes = {
  datasets: Dataset[]
  onChangeDatasets: (d: Dataset[]) => any
  onSelectRow: (cmdline: string) => any
  onToggleShowOverlay: () => void
}

export function Table({
  datasets,
  onChangeDatasets,
  onSelectRow,
  onToggleShowOverlay,
}: PropTypes) {
  const [columns] = useState([...defaultColumns])
  const [columnVisibility, setColumnVisibility] = useState({
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
  })
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const dataTable = useReactTable<Dataset>({
    data: datasets,
    columns,
    defaultColumn: {
      minSize: 20,
      maxSize: 400,
    },
    state: {
      columnVisibility,
      columnOrder,
      sorting,
    },
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility as any,
    onColumnOrderChange: setColumnOrder,
    onSortingChange: setSorting,
    getRowId: (row) => row.cmdline,
  })

  const tbodyRef = useRef<HTMLTableSectionElement>(null)

  const cycleQc = (cmdline: string) => {
    const idx = datasets.findIndex((d) => d.cmdline === cmdline)
    const dataset = datasets[idx]

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

    onChangeDatasets(replace(datasets, idx, { ...dataset, qc: nextQc }))
  }

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTableRowElement>) => {
      event.stopPropagation()
      if (!tbodyRef.current) {
        return
      }

      const row = event.currentTarget

      const currentRow = tbodyRef.current.children.namedItem(row.id)

      let sibling

      switch (event.key) {
        case 'f':
          cycleQc(row.id)
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
    [tbodyRef.current, cycleQc],
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

  return (
    <>
      <ColumnSelect
        onChange={() => {}}
        columns={dataTable.getAllLeafColumns()}
      />
      <div className="overflow-y-scroll max-w-full overflow-x-scroll">
        <table className="border-1 border-gray-200 rounded-sm text-[10px] border-spacing-0 border-separate flex-1">
          <thead className="bg-gray-300 rounded-sm">
            {dataTable.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left"
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
          <tbody ref={tbodyRef}>
            {dataTable.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                id={row.id}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onFocus={() => onSelectRow(row.id)}
                onClick={() => onSelectRow(row.id)}
                className="focus:bg-gray-50"
                autoFocus={i === 0}
              >
                {row.getVisibleCells().map((cell, i) => (
                  <td
                    key={cell.id}
                    className="p-2 border-gray-200 border-1 text-wrap overflow-hidden min-w-4"
                    style={{
                      maxWidth: columnSizes[i],
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
