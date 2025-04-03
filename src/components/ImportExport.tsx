import { useCallback } from 'react'
import { saveAs } from 'file-saver'

import { Dataset } from '@/App'
import Button from '@/components/Button'
import { TableState } from '@/components/Table'
import { YamlExport } from '@/components/YamlExport'
import { getConstants } from '@/util/constants'

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
    const tableState = localStorage.getItem(
      getConstants().TABLE_LOCAL_STORAGE_KEY,
    )
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

    saveAs(blob, 'qc_report.json')
  }, [datasets])

  const loadFromFile = useCallback(
    (parsedObject: { datasets: Dataset[]; tableState?: TableState }) => {
      if (!parsedObject?.datasets) {
        console.error(`Invalid file: ${parsedObject}`)
        return
      }

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
      <YamlExport datasets={datasets} />
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
