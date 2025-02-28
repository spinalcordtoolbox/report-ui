import { useState } from 'react'
import classNames from 'classnames'
import { replace } from 'util/replace'

export interface Dataset {
  label: string
  count: number
}

// ugly way to convince Typescript to accept our hacky global
const INITIAL_DATASETS = (window as any).SCT_QC_DATASETS as Array<Dataset>

function App() {
  const [datasets, setDatasets] = useState<Array<Dataset>>(INITIAL_DATASETS)

  return (
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
  )
}

export default App
