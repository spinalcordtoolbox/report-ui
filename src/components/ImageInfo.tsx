import React from 'react'
import classNames from 'classnames'

import { FitMode } from '@/ImageDisplay'
import Button from '@/components/Button'
import RadioSelect from '@/components/SelectFitMode'
import KeyIcon from '@/components/KeyIcon'

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
  /* Add soft breaks ("line break opportunities") after commas and inside long strings to let
   *  cmdline break gracefully without interfering with copy/paste
   */
  const cmdlineWithSplits = cmdLine
    ?.split(/(\S+?,)/) // commas
    .flatMap((s) => s.split(/(\w{20})/)) // words > 20 chars
    .filter((s) => s) // filter blanks

  return sctVersion ? (
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
          <span>{sctVersion}</span>
        </div>
        <div className="w-full space-x-2 break-words">
          <span className="font-bold">Command:</span>
          <span>
            {cmdlineWithSplits?.map((s, i) => (
              <React.Fragment key={i}>
                {s}
                <wbr />
              </React.Fragment>
            ))}
          </span>
        </div>
      </div>
    </div>
  ) : null
}
