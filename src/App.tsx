import { useCallback, useState } from 'react'
import classNames from 'classnames'

import logoUrl from 'assets/sct_logo.png'
import { Table } from 'components/Table'
import { ImageOverlay } from 'components/ImageOverlay'
import Legend from 'components/Legend'
import { ImageInfo } from 'components/ImageInfo'

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

function App() {
  const [datasets, setDatasets] = useState<Array<Dataset>>(
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
            onChangeDatasets={setDatasets}
            onSelectRow={handleSelectRow}
            onToggleShowOverlay={() => setShowOverlay((o) => !o)}
          />
        </div>

        <div
          className={classNames(
            'w-full lg:w-7/12 h-1/2 lg:h-full p-4',
            'flex flex-col justify-between items-center flex-nowrap space-y-4',
          )}
        >
          <div className="w-full h-10 hidden lg:block min-h-0"></div>
          <div className="w-full max-h-[80%] relative min-h-0">
            <ImageOverlay
              backgroundImage={backgroundImage}
              overlayImage={overlayImage}
              showOverlay={showOverlay}
            />
          </div>
          <div className="w-full min-h-0">
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
