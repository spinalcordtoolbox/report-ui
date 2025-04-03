import { useCallback, useEffect, useState } from 'react'
import { Column } from '@tanstack/react-table'
import classNames from 'classnames'

import { Dataset } from '@/App'

export default function ColumnSelect({
  columns,
}: {
  onChange: () => void
  columns: Column<Dataset>[]
}) {
  const [entering, setEntering] = useState(false)
  const [open, setOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const toggleOpen = useCallback(() => {
    if (!open) {
      setEntering(true)
      setOpen(true)
      setTimeout(() => setEntering(false), 110)
    } else {
      setLeaving(true)
      setOpen(false)
      setTimeout(() => setLeaving(false), 100)
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open || e.key !== 'Escape') {
        return
      }

      toggleOpen()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, toggleOpen])

  useEffect(() => {
    const target = document.querySelector('#focus-target')

    const handler = (event: MouseEvent) => {
      if (!target || !open || entering) return
      const withinBoundaries = event.composedPath().includes(target)

      if (!withinBoundaries) {
        setOpen(false)
      }
    }

    document.addEventListener('click', handler)

    return () => document.removeEventListener('click', handler)
  }, [open, entering])

  return (
    <div className="relative inline-block text-left w-80">
      <div className="w-40">
        <button
          type="button"
          className={classNames(
            'inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2',
            'text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50',
            'cursor-pointer select-none',
          )}
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={toggleOpen}
        >
          Display Columns
          <svg
            className="-mr-1 size-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div
        id="focus-target"
        className={classNames(
          'absolute left-0 z-10 mt-1 w-56 origin-top-left rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden transform',
          {
            'transition ease-out duration-100': entering,
            'transition ease-in duration-75': leaving,
            hidden: !open && !leaving,
          },
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        )}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
      >
        <div className="py-1" role="none">
          {columns.map((column) =>
            typeof column.columnDef.header === 'string' ? (
              <a
                key={column.id}
                id={column.id}
                onClick={open ? column.getToggleVisibilityHandler() : () => {}}
                className={classNames(
                  'block px-4 py-1 text-sm text-gray-700 cursor-pointer select-none',
                  'active:bg-gray-100 active:text-gray-900 active:outline-hidden',
                  'hover:bg-gray-100 hover:text-gray-900 hover:outline-hidden',
                  { 'pointer-events-none': !open },
                )}
                role="menuitem"
                tabIndex={-1}
              >
                {column.columnDef.header}{' '}
                <span className="font-bold">
                  {column.getIsVisible() ? '✓' : ' '}
                </span>
              </a>
            ) : null,
          )}
        </div>
      </div>
    </div>
  )
}
