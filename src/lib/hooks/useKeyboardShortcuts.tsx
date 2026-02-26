import { useCallback } from 'react'
import { Options, useHotkeys } from 'react-hotkeys-hook'

import { Dataset } from '@/components/Datasets'

export function useKeyboardShortcuts(
  datasets: Dataset[],
  onChangeDataset: (id: string, replaceDatasets: Partial<Dataset>) => void,
  tbodyRef: React.RefObject<HTMLTableSectionElement | null>,
  onToggleImageFit: () => void,
  onToggleShowOverlay: () => void,
  selectedId: string | undefined,
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

      onChangeDataset(id, { qc: nextQc })
    },
    [datasets],
  )

  const updateRank = useCallback((id: string, rank: number) => {
    if (!(rank >= 0 && rank <= 9)) {
      console.error(`Invalid rank set for ${id}: ${rank}`)
      return
    }

    onChangeDataset(id, { rank })
  }, [])

  // handle moving up or down by one row
  const handleSelectSibling = useCallback(
    (up: boolean) => {
      if (!tbodyRef.current) {
        return
      }

      const currentRow = selectedId
        ? tbodyRef.current.children.namedItem(selectedId)
        : null

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
    [selectedId],
  )

  const options: Options = {
    useKey: true, // respect keyboard format
    preventDefault: true,
    enableOnFormTags: ['radio', 'select'], // capture keys even on toggle buttons
  }

  useHotkeys('up, k', () => handleSelectSibling(true), options, [selectedId])
  useHotkeys('down, j', () => handleSelectSibling(false), options, [selectedId])
  useHotkeys(
    'f',
    () => {
      if (!selectedId) return
      cycleQc(selectedId)
    },
    options,
    [selectedId, datasets],
  )
  // keys 0-9
  Array(10)
    .fill(0)
    .forEach((_, i) => {
      useHotkeys(
        i.toString(),
        () => {
          if (!selectedId) return
          updateRank(selectedId, i)
        },
        options,
        [selectedId, datasets],
      )
    })

  useHotkeys('mod+k, /', onFocusSearch, options)
  useHotkeys('d', onToggleImageFit, options)
  useHotkeys('right', onToggleShowOverlay, options)
}
