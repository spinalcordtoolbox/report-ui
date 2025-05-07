import { useCallback, useMemo } from 'react'
import { Dataset } from '@/App'
import { replaceDataset } from '@/util/replace'

export default function useKeyboardShortcuts(
  datasets: Dataset[],
  onChangeDatasets: (replaceDatasets: Dataset[]) => void,
  tbodyRef: React.RefObject<HTMLTableSectionElement | null>,
  onToggleImageFit: () => void,
  onToggleShowOverlay: () => void,
  onSelectRow: (id: string) => any,
  onFocusSearch: () => any,
) {
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

    onChangeDatasets(replaceDataset(datasets, id, { qc: nextQc }))
  }

  const updateRank = useCallback(
    (id: string, rank: number) => {
      if (!(rank >= 0 && rank <= 9)) {
        console.error(`Invalid rank set for ${id}: ${rank}`)
        return
      }

      onChangeDatasets(replaceDataset(datasets, id, { rank }))
    },
    [datasets, onChangeDatasets],
  )

  const keyDebug = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return !!params.get('debug_keys')
  }, [window.location.search])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTableRowElement>) => {
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

      if (event.getModifierState('Control') || event.getModifierState('Meta')) {
        if (event.key === 'k' || event.key === 'K') {
          onFocusSearch()
        }
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
          event.preventDefault()
          event.stopPropagation()
          return
        case 'ArrowUp':
          sibling = currentRow?.previousElementSibling
          event.preventDefault()
          event.stopPropagation()
          break
        case 'ArrowDown':
          sibling = currentRow?.nextElementSibling
          event.preventDefault()
          event.stopPropagation()
          break
        case '/':
          event.preventDefault()
          event.stopPropagation()
          onFocusSearch()
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

  return handleKeyDown
}
