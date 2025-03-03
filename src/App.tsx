import { useState } from 'react'
import classNames from 'classnames'
import { replace } from 'util/replace'

import logoUrl from 'assets/sct_logo.png'

export interface Dataset {
  label: string
  count: number
}

// ugly way to convince Typescript to accept our hacky global
const INITIAL_DATASETS = (window as any).SCT_QC_DATASETS as Array<Dataset>

function App() {
  const [datasets, setDatasets] = useState<Array<Dataset>>(INITIAL_DATASETS)

  return (
    <>
      <nav className="min-h-12 mr-auto ml-auto px-4 border-b-2 border-gray-200 bg-gray-100">
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
      <div className="h-dvh flex flex-col p-4 items-center justify-center">
        <h1 className="text-3xl font-bold underline">Hello world!</h1>

        {datasets.map(({ label, count }, i) => (
          <button
            key={i}
            className={classNames(
              'mt-4 p-2 py-0 border-black/50 border-2 rounded-sm max-w-fit',
              'cursor-pointer font-bold transition-colors',
              'hover:bg-slate-300',
            )}
            onClick={() =>
              setDatasets(replace(datasets, i, { label, count: count + 1 }))
            }
          >
            {label} count is {count}
          </button>
        ))}
      </div>
    </>
  )
}

export default App
