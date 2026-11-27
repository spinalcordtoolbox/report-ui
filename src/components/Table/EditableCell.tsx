import { useEffect, useRef, useState } from 'react'
import { CellContext, ColumnDefTemplate } from '@tanstack/react-table'
import {
  useFloating,
  useDismiss,
  useRole,
  useInteractions,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  hide,
  FloatingArrow,
  FloatingPortal,
  FloatingFocusManager,
} from '@floating-ui/react'

import { Dataset } from '@/components/Datasets'
import Button from '@/components/Button'

const ARROW_FILL = 'white'
const ARROW_STROKE = '#6a7282'

export const EditableCell: ColumnDefTemplate<CellContext<Dataset, unknown>> = ({
  getValue,
  row: { index },
  column: { id },
  table,
}) => {
  const initialValue = getValue()
  const [value, setValue] = useState(initialValue)
  // Keep local state in sync if the data changes from outside
  useEffect(() => setValue(initialValue), [initialValue])

  const [open, setOpen] = useState(false)

  const save = () => {
    if (value !== initialValue) table.options.meta?.updateData(index, id, value)
  }
  const close = (commit: boolean) => {
    if (commit) save()
    else setValue(initialValue)
    setOpen(false)
  }

  // If the row is virtualized out while editing, the component unmounts
  // without any blur/dismiss event, so save on unmount.
  const saveRef = useRef(save)
  saveRef.current = open ? save : () => {}
  useEffect(() => () => saveRef.current(), [])

  const arrowRef = useRef<SVGSVGElement>(null)
  const { refs, floatingStyles, context, middlewareData } = useFloating({
    open,
    onOpenChange: (next) => (next ? setOpen(true) : close(true)), // outside click = save
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate, // follows the cell while the table scrolls
    middleware: [
      offset(10),
      flip(),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
      hide(), // hide while the cell is scrolled out of the scroll container
    ],
  })

  const dismiss = useDismiss(context, { escapeKey: false }) // Escape handled below (cancel)
  const role = useRole(context, { role: 'dialog' })
  const { getReferenceProps, getFloatingProps } = useInteractions([
    dismiss,
    role,
  ])

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className="flex items-start justify-between max-h-full overflow-hidden"
      >
        <span
          title={value as string}
          className="flex-1 min-w-40 overflow-hidden text-ellipsis h-full"
        >
          {value as string}
        </span>
        <Button
          aria-label="Edit notes"
          className="shrink-0 flex-1 text-lg max-h-8 max-w-12"
          onClick={() => (open ? close(true) : setOpen(true))}
        >
          ✎
        </Button>
      </div>

      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              className="z-50 w-md p-2 bg-white border-1 border-gray-500 rounded-sm shadow"
              {...getFloatingProps()}
              style={{
                ...floatingStyles,
                visibility: middlewareData.hide?.referenceHidden
                  ? 'hidden'
                  : 'visible',
              }}
            >
              <FloatingArrow
                ref={arrowRef}
                context={context}
                fill={ARROW_FILL}
                stroke={ARROW_STROKE}
                strokeWidth={1}
              />
              <textarea
                autoFocus
                value={value as string}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') close(true)
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) close(true)
                }}
                rows={6}
                className="w-full p-2 resize-y"
              />
              <div className="flex justify-end gap-4 mt-4">
                <Button type="button" onClick={() => close(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => close(true)}>
                  Save
                </Button>
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  )
}
