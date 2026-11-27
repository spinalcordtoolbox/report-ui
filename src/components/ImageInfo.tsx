import classNames from 'classnames'

import { FitMode } from '@/ImageDisplay'
import Button from '@/components/Button'
import KeyIcon from '@/components/KeyIcon'
import CommandDisplay from '@/components/CommandDisplay'

export function ImageInfo({
  className,
  cmdLine,
  sctVersion,
  onToggleShowOverlay,
  fitMode,
  onChangeFitMode,
}: {
  className?: string
  cmdLine?: string
  sctVersion?: string
  onToggleShowOverlay: () => void
  fitMode: FitMode
  onChangeFitMode: (m: FitMode) => any
}) {
  return sctVersion ? (
    <div className={classNames(className, 'flex flex-col space-y-1')}>
      <div className="flex space-x-2">
        <Button onClick={onToggleShowOverlay} className="hidden lg:block">
          <span className="leading-0">Toggle overlay</span>
          <KeyIcon label="→" className="pb-0.5" />
        </Button>
        <Button
          onClick={() => onChangeFitMode(fitMode === 'fit' ? 'full' : 'fit')}
          className="hidden lg:block"
        >
          <span className="leading-0">Toggle image fit</span>
          <KeyIcon label="D" className="pb-0.5" />
        </Button>
      </div>
      <div className="w-full flex flex-col overflow-y-scroll overflow-x-clip p-2 border-gray-500 rounded-sm border-1">
        <div className="space-x-2">
          <span className="font-bold">SCT version:</span>
          <span>{sctVersion}</span>
        </div>
        <div className="w-full space-x-2 break-words">
          <CommandDisplay cmdLine={cmdLine} />
        </div>
      </div>
    </div>
  ) : null
}
