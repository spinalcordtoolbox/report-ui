import { useCallback, useEffect, useState } from 'react'
import { useLocalStorage } from '@uidotdev/usehooks'
import classNames from 'classnames'

import logoUrl from 'assets/sct_logo.png'
import {
  Table,
  LOCAL_STORAGE_KEY as TABLE_LOCAL_STORAGE_KEY,
  TableState,
} from 'components/Table'
import { ImageOverlay } from 'components/ImageOverlay'
import Legend from 'components/Legend'
import { ImageInfo } from 'components/ImageInfo'
import Loading from 'components/Loading'
import Button from 'components/Button'

const LabelButton = Button<HTMLLabelElement>

export interface Dataset {
  path: string
  cmdline: string
  command: string
  sctVersion: string
  dataset: string
  subject: string
  contrast: string
  inputFile: string
  plane: string
  backgroundImage: string
  overlayImage: string
  date: string
  rank: number
  qc: string
}

// ugly way to convince Typescript to accept our hacky global
const INITIAL_DATASETS = (window as any).SCT_QC_DATASETS as Array<Dataset>

function cleanDataset(dataset: Dataset): Dataset {
  return {
    ...dataset,
    backgroundImage: dataset.backgroundImage.replace(/^([^/])/, '/$1'),
    overlayImage: dataset.overlayImage.replace(/^([^/])/, '/$1'),
  }
}

const LOCAL_STORAGE_KEY = 'sct-qc-report_datasets'

function App() {
  const [datasets, setDatasets] = useLocalStorage<Array<Dataset>>(
    LOCAL_STORAGE_KEY,
    INITIAL_DATASETS.map(cleanDataset),
  )

  const [selected, setSelected] = useState<Dataset>()

  const [backgroundImage, setBackgroundImage] = useState('')
  const [overlayImage, setOverlayImage] = useState('')
  const [showOverlay, setShowOverlay] = useState(true)

  const handleSelectRow = useCallback(
    (cmdline: string) => {
      const dataset = datasets.find((r) => r.cmdline == cmdline)
      setSelected(dataset)
      setBackgroundImage(dataset?.backgroundImage ?? '')
      setOverlayImage(dataset?.overlayImage ?? '')
    },
    [datasets],
  )

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

  const [loading, setLoading] = useState(false)
  const [initialTableState, setInitialTableState] = useState<TableState | null>(
    null,
  )

  const loadFromFile = useCallback(
    (parsedObject: { datasets: Dataset[]; tableState?: TableState }) => {
      if (!parsedObject?.datasets) {
        console.error(`Invalid file: ${parsedObject}`)
        return
      }

      console.dir(parsedObject)

      const { datasets } = parsedObject

      setLoading(true)
      setDatasets(datasets)

      if (parsedObject.tableState) {
        setInitialTableState(parsedObject.tableState)
      }
    },
    [setLoading, setInitialTableState, setDatasets],
  )

  /* Force a render cycle before loading goes away, to force unmounts */
  useEffect(() => {
    console.dir(loading)
    if (!loading) {
      return
    }
    setLoading(false)
  }, [loading])

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

  /* Force unmount of components while loading */
  if (loading) {
    console.dir('loading...')
    return <Loading />
  }

  return (
    <>
      <nav className="h-12 mr-auto ml-auto px-4 border-b-2 border-gray-200 bg-gray-100 ">
        <div className="flex flex-row flex-nowrap justify-between items-center">
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <div className="flex flex-row flex-nowrap items-center">
              <img src={logoUrl} className="h-7" />
              <span className="h-12 p-4 text-lg leading-5">
                SCT - Quality Control
              </span>
            </div>
          </a>
          <a
            href="https://spinalcordtoolbox.com/"
            className="text-sm text-gray-400 hover:text-gray-700"
          >
            SCT Home
          </a>
        </div>
      </nav>
      <div
        className={classNames(
          'h-[calc(100vh_-_--spacing(12))] lg:max-h-[1024px] p-4 max-w-dvw overflow-hidden',
          'flex flex-col flex-nowrap lg:flex-row lg:space-y-0 lg:space-x-4',
        )}
      >
        <div className="flex flex-col space-y-2 w-full lg:w-5/12 h-1/2 lg:h-full">
          <Legend />
          <Table
            datasets={datasets}
            initialTableState={initialTableState}
            onChangeDatasets={setDatasets}
            onSelectRow={handleSelectRow}
            onToggleShowOverlay={() => setShowOverlay((o) => !o)}
          />
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
        </div>

        <div
          className={classNames(
            'w-full lg:w-7/12 h-1/2 lg:h-full p-4',
            'flex flex-col items-center flex-nowrap space-y-4 relative',
          )}
        >
          <div className="w-full h-[calc(100%_-_--spacing(40))] relative min-h-0">
            <ImageOverlay
              backgroundImage={backgroundImage}
              overlayImage={overlayImage}
              showOverlay={showOverlay}
            />
          </div>
          <div className="absolute bottom-0 w-full px-4 h-40 overflow-hidden flex flex-col space-y-1 self-end justify-self-end">
            <ImageInfo
              selected={selected}
              onToggleShowOverlay={() => setShowOverlay((o) => !o)}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
