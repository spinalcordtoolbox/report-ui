import classNames from 'classnames'

import { Dataset } from '@/App'
import { FitMode } from '@/ImageDisplay'

import Button from '@/components/Button'
import RadioSelect from '@/components/SelectFitMode'
import KeyIcon from '@/components/KeyIcon'

export function ImageInfo({
  className,
  selected,
  onToggleShowOverlay,
  fitMode,
  onChangeFitMode,
}: {
  className?: string
  selected?: Dataset
  onToggleShowOverlay: () => void
  fitMode: FitMode
  onChangeFitMode: (m: FitMode) => any
}) {
  return selected ? (
    <div className={classNames(className, 'flex flex-col space-y-1')}>
      <div className="flex space-x-2">
        <Button onClick={onToggleShowOverlay} className="hidden lg:block">
          <span className="leading-0">Toggle overlay</span>
          <KeyIcon label="→" className="pb-0.5" />
        </Button>
        <RadioSelect fitMode={fitMode} onChangeFitMode={onChangeFitMode} />
      </div>
      <div className="w-full flex flex-col overflow-y-scroll overflow-x-clip p-2 border-gray-500 rounded-sm border-1">
        <div className="space-x-2">
          <span className="font-bold">SCT version:</span>
          <span>{selected.sctVersion}</span>
        </div>
        <div className="w-full space-x-2 break-words">
          <span className="font-bold">Command:</span>
          <span>{selected.cmdline}</span>
        </div>
      </div>
    </div>
  ) : null
}
