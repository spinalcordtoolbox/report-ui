import { useCallback, useRef } from 'react'
import { Options, useHotkeys } from 'react-hotkeys-hook'

import { Dataset } from '@/components/Datasets'

export function useKeyboardShortcuts(
  datasets: Dataset[],
  onChangeDataset: (id: string, replaceDatasets: Partial<Dataset>) => void,
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

  const REPEAT_INTERVAL_MS = 150
  const lastMoveRef = useRef(0)

  // handle moving up or down by one row
  const handleSelectSibling = useCallback(
    (up: boolean, repeat: boolean, timeStamp: number) => {
      // throttle keypresses
      if (repeat && timeStamp - lastMoveRef.current < REPEAT_INTERVAL_MS) return
      lastMoveRef.current = timeStamp

      const idx = selectedId
        ? datasets.findIndex((d) => d.id == selectedId)
        : -1

      let siblingIdx = up ? idx - 1 : idx + 1

      /* Wrap top and bottom of list: if none selected and up pressed, select last item, and
       * vice versa for down.
       * Note: we can't use the DOM (e.g., tbodyRef children) here because of row virtualization.
       * The rendered firstElementChild will be in the middle of the list depending on where
       * we're scrolled to. Instead, we just select a dataset, and depend on a layout effect
       * in TableBody to actually focus the corresponding DOM element
       */
      if (siblingIdx < 0) {
        siblingIdx = datasets.length - 1
      } else if (siblingIdx >= datasets.length) {
        siblingIdx = 0
      }

      const sibling = datasets[siblingIdx]

      onSelectRow(sibling.id)
    },
    [selectedId, JSON.stringify(datasets)],
  )

  const options: Options = {
    useKey: true, // respect keyboard format
    preventDefault: true,
    enableOnFormTags: ['radio', 'select'], // capture keys even on toggle buttons
  }

  useHotkeys(
    'up, k',
    ({ repeat, timeStamp }) => handleSelectSibling(true, repeat, timeStamp),
    options,
    [selectedId],
  )
  useHotkeys(
    'down, j',
    ({ repeat, timeStamp }) => handleSelectSibling(false, repeat, timeStamp),
    options,
    [selectedId],
  )
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
