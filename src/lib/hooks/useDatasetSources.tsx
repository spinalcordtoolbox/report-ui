import React, { useEffect } from 'react'
import { useLocalStorage } from '@uidotdev/usehooks'

import { Dataset } from '@/App'
import { getConstants } from '@/util/constants'

function cleanDataset(dataset: Dataset): Dataset {
  return {
    ...dataset,
    backgroundImage: dataset.backgroundImage.replace(/^([^/])/, '/$1'),
    overlayImage: dataset.overlayImage.replace(/^([^/])/, '/$1'),
  }
}

async function generateId(d: Dataset): Promise<[id: string, d: Dataset]> {
  const encoder = new TextEncoder()
  const data = encoder.encode(`${d.path}:${d.cmdline}:${d.date}`)
  const hashBuffer = await window.crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const id = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return [id, d]
}

export function useDatasetSources(): [
  Dataset[],
  React.Dispatch<React.SetStateAction<Dataset[]>>,
] {
  const { DATASETS_LOCAL_STORAGE_KEY, INITIAL_DATASETS, DATASETS_PATH_PREFIX } =
    getConstants()
  const initialData = INITIAL_DATASETS.map(cleanDataset)

  const [localStorageDatasets, setDatasets] = useLocalStorage<Array<Dataset>>(
    DATASETS_LOCAL_STORAGE_KEY,
    initialData,
  )

  /* Once, on app mount, check for changes in the datasets injected into the window, e.g., by
   * running refresh_qc_entries
   * Overwrite localstorage with any changed values, preserving QC and Rank values
   */
  let initialized = false
  useEffect(() => {
    if (initialized) {
      return
    }

    Promise.all(initialData.map(generateId)).then((ids) => {
      const mergedData = ids.map((pair) => {
        const [id, dataset] = pair
        let qc = ''
        let rank = null
        const localMatch = localStorageDatasets.find((d) => d.id && d.id === id)
        if (localMatch) {
          qc = localMatch.qc
          rank = localMatch.rank
        }

        return {
          ...dataset,
          id,
          qc,
          rank,
          backgroundImage: `${DATASETS_PATH_PREFIX}${dataset.backgroundImage}`,
          overlayImage: `${DATASETS_PATH_PREFIX}${dataset.overlayImage}`,
        }
      }, [])

      setDatasets(mergedData)
      initialized = true
    })
  }, [])

  return [localStorageDatasets, setDatasets]
}
