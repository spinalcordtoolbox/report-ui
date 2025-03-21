import { useCallback } from 'react'

import { Dataset } from 'App'
import Button from 'components/Button'
import {
  LOCAL_STORAGE_KEY as TABLE_LOCAL_STORAGE_KEY,
  TableState,
} from 'components/Table'

const LabelButton = Button<HTMLLabelElement>

type PropTypes = {
  datasets: Dataset[]
  onInitFileLoad: () => any
  onSetDatasets: (d: Dataset[]) => any
  onSetInitialTableState: (s: TableState) => any
}

export function ImportExport({
  datasets,
  onInitFileLoad,
  onSetDatasets,
  onSetInitialTableState,
}: PropTypes) {
  const exportAll = useCallback(() => {
    const tableState = localStorage.getItem(TABLE_LOCAL_STORAGE_KEY)
    const tableJson = tableState ? JSON.parse(tableState) : null

    const blob = new Blob(
      [
        JSON.stringify({
          datasets,
          ...{ ...(tableJson ? { tableState: tableJson } : {}) },
        }),
      ],
      { type: 'application/json' },
    )

    const href = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = 'qc_report.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(href)
  }, [datasets])

  const loadFromFile = useCallback(
    (parsedObject: { datasets: Dataset[]; tableState?: TableState }) => {
      if (!parsedObject?.datasets) {
        console.error(`Invalid file: ${parsedObject}`)
        return
      }

      console.dir(parsedObject)

      const { datasets } = parsedObject

      onInitFileLoad()
      onSetDatasets(datasets)

      if (parsedObject.tableState) {
        onSetInitialTableState(parsedObject.tableState)
      }
    },
    [onInitFileLoad, onSetInitialTableState, onSetDatasets],
  )

  const handleFileChosen = useCallback(
    (file: File | undefined) => {
      if (!file) {
        return
      }
      const fileReader = new FileReader()
      new Promise<ProgressEvent<FileReader>>((resolve, reject) => {
        fileReader.onloadend = resolve
        fileReader.onerror = (e: ProgressEvent<FileReader>) => {
          reject(`File read failed: ${e}`)
        }
        fileReader.readAsText(file)
      }).then((e) => {
        const json = e.target?.result
        if (typeof json !== 'string') {
          console.error('Unsupported file type')
          return
        }

        loadFromFile(JSON.parse(json))
      })
    },
    [loadFromFile],
  )
  return (
    <div className="flex flex-row items-center space-x-2">
      <Button onClick={exportAll}>Save All</Button>
      <input
        id="fileUpload"
        type="file"
        accept=".json"
        className="hidden"
        onChange={(e) => handleFileChosen(e.target.files?.[0])}
      />
      <LabelButton
        asComponent="label"
        htmlFor="fileUpload"
        className="cursor-pointer"
      >
        Upload all
      </LabelButton>
    </div>
  )
}
