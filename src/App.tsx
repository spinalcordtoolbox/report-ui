import { useCallback, useState } from 'react'
import classNames from 'classnames'

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
          'h-[calc(100vh_-_--spacing(12))] max-h-[1024px] p-4 max-w-dvw overflow-hidden',
          'flex flex-col flex-nowrap lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4',
        )}
      >
        <div className="flex-1 flex flex-col space-y-2 w-full lg:w-5/12 h-1/2 lg:h-full">
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
            'flex-1 w-full lg:w-7/12 h-1/2 lg:h-full',
            'flex flex-col justify-center items-center flex-nowrap space-y-4',
          )}
        >
          <div className="relative w-full h-[calc(100%_-_--spacing(24))] lg:mt-24">
            <ImageOverlay
              backgroundImage={backgroundImage}
              overlayImage={overlayImage}
              showOverlay={showOverlay}
            />
          </div>
          {selected ? (
            <>
              <button
                onClick={() => setShowOverlay((o) => !o)}
                className={classNames(
                  'hidden lg:block h-10 w-fit border-gray-500 border-1 rounded-sm mb-1 self-start',
                  'cursor-pointer hover:bg-gray-100/50 active:bg-gray-100 transition-colors',
                )}
              >
                <div className="h-full w-fit py-1 px-4 flex flex-row flex-nowrap items-center space-x-2">
                  <span className="leading-0">Toggle overlay</span>
                  <img className="h-full" src="/keyright.png" />
                </div>
              </button>
              <div className="w-full flex flex-col overflow-y-scroll overflow-x-clip p-2 border-gray-500 rounded-sm border-1">
                <div className="w-full space-x-2 break-words">
                  <span className="font-bold">Command:</span>
                  <span>{selected.cmdline}</span>
                </div>
                <span>
                  <span className="font-bold">SCT version:</span>
                  {selected.sctVersion}
                </span>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default App
