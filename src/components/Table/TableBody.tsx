import { forwardRef } from 'react'
import { Row, Table } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'

import { Dataset } from '@/components/Datasets'
import TableBodyRow from '@/components/Table/TableBodyRow'

type PropTypes = {
  table: Table<Dataset>
  tableContainerRef: React.RefObject<HTMLDivElement | null>
  selectedId: string | undefined
  onSelectRow: (id: string) => any
}

function TableBody(
  { table, tableContainerRef, selectedId, onSelectRow }: PropTypes,
  ref: React.ForwardedRef<HTMLTableSectionElement>,
) {
  const { rows } = table.getRowModel()

  // Important: Keep the row virtualizer in the lowest component possible to avoid unnecessary re-renders.
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 48, // estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })

  return (
    <tbody ref={ref}>
      {rowVirtualizer.getVirtualItems().map((virtualRow, i) => {
        const row = rows[virtualRow.index] as Row<Dataset>
        return (
          <TableBodyRow
            key={row.id}
            row={row}
            virtualRow={virtualRow}
            rowVirtualizer={rowVirtualizer}
            autoFocus={i === 0}
            selectedId={selectedId}
            onSelectRow={onSelectRow}
          />
        )
      })}
    </tbody>
  )
}

export default forwardRef(TableBody)
