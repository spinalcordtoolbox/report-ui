import { useCallback, useState } from 'react'

import logoUrl from 'assets/sct_logo.png'
import { Table } from 'components/Table'
import { ImageOverlay } from 'components/ImageOverlay'
import Legend from 'components/Legend'

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
      <div className="h-[calc(100vh_-_--spacing(12))] p-4 max-w-dvw overflow-hidden flex flex-col flex-nowrap lg:flex-row">
        <div className="flex-1 flex flex-col space-y-2 w-full lg:w-1/2 h-1/2 lg:h-full">
          <Legend />
          <Table
            datasets={datasets}
            onChangeDatasets={setDatasets}
            onSelectRow={handleSelectRow}
            onToggleShowOverlay={() => setShowOverlay(!showOverlay)}
          />
        </div>

        <div className="flex-1 relative w-full lg:w-1/2 h-1/2 lg:h-full">
          <ImageOverlay
            backgroundImage={backgroundImage}
            overlayImage={overlayImage}
            showOverlay={showOverlay}
          />
        </div>
      </div>
    </>
  )
}

export default App
