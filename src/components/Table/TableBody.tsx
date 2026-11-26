import { useLayoutEffect, useRef } from 'react'
import { Row, Table } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'

import { Dataset } from '@/components/Datasets'
import TableBodyRow from '@/components/Table/TableBodyRow'

type PropTypes = {
  table: Table<Dataset>
  tableContainerRef: React.RefObject<HTMLDivElement | null>
  datasetsSorted: Dataset[]
  selectedId: string | undefined
  onSelectRow: (id: string) => any
}

function TableBody({
  table,
  tableContainerRef,
  datasetsSorted,
  selectedId,
  onSelectRow,
}: PropTypes) {
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
    overscan: 10,
  })

  const ref = useRef<HTMLTableSectionElement>(null)

  /* On any change in selected row, ensure the selected row is being rendered by the virtualizer,
   * then focus that row */
  useLayoutEffect(() => {
    if (!ref.current || !selectedId) return

    /* Make sure virtual row is actually in view so the DOM element exists */
    const selectedIdx = datasetsSorted.findIndex((d) => d.id === selectedId)
    rowVirtualizer.scrollToIndex(selectedIdx)

    const selectedElement = ref.current.querySelector<HTMLTableRowElement>(
      '#' + CSS.escape(selectedId),
    )

    if (!selectedElement) {
      return
    }

    selectedElement.focus()
  }, [selectedId, datasetsSorted])

  return (
    <tbody
      ref={ref}
      className="grid relative w-full"
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
      }}
    >
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

export default TableBody
