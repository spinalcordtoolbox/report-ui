import { useCallback, useState } from 'react'
import classNames from 'classnames'

import logoUrl from 'assets/sct_logo.png'
import { Table } from 'components/Table'

export interface Dataset {
  cwd: string
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
  rank: string
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

function App() {
  const [datasets, setDatasets] = useState<Array<Dataset>>(
    INITIAL_DATASETS.map(cleanDataset),
  )

  const [backgroundImage, setBackgroundImage] = useState('')
  const [overlayImage, setOverlayImage] = useState('')

  const [showOverlay, setShowOverlay] = useState(true)

  const handleSelectRow = useCallback(
    (cmdline: string) => {
      const dataset = datasets.find((r) => r.cmdline == cmdline)
      setBackgroundImage(dataset?.backgroundImage ?? '')
      setOverlayImage(dataset?.overlayImage ?? '')
    },
    [datasets],
  )

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
      <div className="h-[calc(100vh_-_--spacing(12))] flex flex-row p-4 justify-center flex-wrap sm:flex-nowrap space-x-4">
        <Table
          datasets={datasets}
          onChangeDatasets={setDatasets}
          onSelectRow={handleSelectRow}
          onToggleShowOverlay={() => setShowOverlay(!showOverlay)}
        />

        <div className="h-full w-1/2 relative">
          <div className="absolute top-4 left-4 right-4 bottom-4">
            {backgroundImage ? (
              <img
                className="absolute h-full w-full top-0 left-0 object-contain"
                src={backgroundImage}
              />
            ) : null}
            {overlayImage ? (
              <img
                className={classNames(
                  'absolute h-full w-full top-0 left-0 object-contain transition-opacity duration-50',
                  showOverlay ? 'opacity-100' : 'opacity-0',
                )}
                src={overlayImage}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
