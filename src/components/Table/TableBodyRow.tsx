import { HTMLAttributes, useCallback, useMemo } from 'react'
import { flexRender, Row } from '@tanstack/react-table'
import { VirtualItem, Virtualizer } from '@tanstack/react-virtual'

import { Dataset } from '@/components/Datasets'
import classNames from 'classnames'

interface TableBodyRowProps extends HTMLAttributes<HTMLTableRowElement> {
  row: Row<Dataset>
  virtualRow: VirtualItem
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>
  selectedId: string | undefined
  onSelectRow: (id: string) => any
}

function TableBodyRow({
  row,
  virtualRow,
  rowVirtualizer,
  selectedId,
  onSelectRow,
  ...props
}: TableBodyRowProps) {
  const handleSelectRow = useCallback(() => onSelectRow(row.id), [])
  const isSelected = useMemo(() => row.id === selectedId, [selectedId])

  return (
    <tr
      key={row.id}
      data-index={virtualRow.index}
      {...props}
      onClick={handleSelectRow}
      onFocus={handleSelectRow}
      id={row.id}
      tabIndex={0}
      className={classNames(
        'focus:bg-gray-300',
        isSelected ? 'bg-gray-300' : null,
      )}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          className="p-2 border-gray-200 border-1 text-wrap overflow-hidden min-w-4 break-words"
          style={{
            maxWidth: Math.min(cell.column.getSize(), 400) || 400,
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  )
}

export default TableBodyRow
