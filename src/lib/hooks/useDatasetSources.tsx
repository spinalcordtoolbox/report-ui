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

    const mergedData = initialData.map((dataset) => {
      let qc = ''
      let rank = null
      const localMatch = localStorageDatasets.find(
        (d) => d.cmdline === dataset.cmdline,
      )
      if (localMatch) {
        qc = localMatch.qc
        rank = localMatch.rank
      }

      return {
        ...dataset,
        qc,
        rank,
        backgroundImage: `${DATASETS_PATH_PREFIX}${dataset.backgroundImage}`,
        overlayImage: `${DATASETS_PATH_PREFIX}${dataset.overlayImage}`,
      }
    }, [])

    setDatasets(mergedData)
    initialized = true
  }, [])

  return [localStorageDatasets, setDatasets]
}
