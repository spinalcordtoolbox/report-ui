import { useCallback } from 'react'
import { saveAs } from 'file-saver'

import { Dataset } from '@/components/Datasets'
import Button from '@/components/Button'
import { TableState } from '@/components/Table'
import { YamlExport } from '@/components/YamlExport'

const LabelButton = Button<HTMLLabelElement>

type PropTypes = {
  datasets: Dataset[]
  tableState: TableState
  onSetDatasets: (d: Dataset[]) => any
  onSetTableState: (s: TableState) => any
}

export function ImportExport({
  datasets,
  tableState,
  onSetDatasets,
  onSetTableState,
}: PropTypes) {
  const exportAll = useCallback(() => {
    const blob = new Blob(
      [
        JSON.stringify({
          datasets,
          tableState,
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

      onSetDatasets(datasets)

      if (parsedObject.tableState) {
        onSetTableState(parsedObject.tableState)
      }
    },
    [onSetTableState, onSetDatasets],
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
