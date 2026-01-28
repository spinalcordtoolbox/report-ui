import { useCallback } from 'react'
import { Options, useHotkeys } from 'react-hotkeys-hook'

import { Dataset } from '@/App'
import { replaceDataset } from '@/util/replace'

export function useKeyboardShortcuts(
  datasets: Dataset[],
  onChangeDatasets: (replaceDatasets: Dataset[]) => void,
  tbodyRef: React.RefObject<HTMLTableSectionElement | null>,
  onToggleImageFit: () => void,
  onToggleShowOverlay: () => void,
  selected: Dataset | undefined,
  onSelectRow: (id: string) => any,
  onFocusSearch: () => any,
) {
  const cycleQc = useCallback(
    (id: string) => {
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
    },
    [datasets],
  )

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

  // handle moving up or down by one row
  const handleSelectSibling = useCallback(
    (up: boolean) => {
      if (!tbodyRef.current) {
        return
      }

      const currentRow = selected && tbodyRef.current.children.namedItem(selected.id)

      let sibling = up
        ? currentRow?.previousElementSibling
        : currentRow?.nextElementSibling

      if (!sibling) {
        // if none selected and up pressed, select last item
        if (up) {
          sibling = tbodyRef.current.lastElementChild
        } else {
          sibling = tbodyRef.current.firstElementChild
        }

        // somehow still nothing?
        if (!sibling) return
      }

      ;(sibling as any).focus()
      onSelectRow(sibling.id)
    },
    [selected],
  )

  // respect keyboad format + prevent propagation
  const options: Options = { useKey: true, preventDefault: true }

  useHotkeys('up', () => handleSelectSibling(true), options, [selected])
  useHotkeys('down', () => handleSelectSibling(false), options, [selected])
  useHotkeys(
    'f',
    () => {
      if (!selected) return
      cycleQc(selected.id)
    },
    options,
    [selected, datasets],
  )
  // keys 0-9
  Array(10)
    .fill(0)
    .forEach((_, i) => {
      useHotkeys(
        i.toString(),
        () => {
          if (!selected) return
          updateRank(selected.id, i)
        },
        options,
        [selected, datasets],
      )
    })

  useHotkeys('mod+k, /', onFocusSearch, options)
  useHotkeys('d', onToggleImageFit, options)
  useHotkeys('right', onToggleShowOverlay, options)
}
