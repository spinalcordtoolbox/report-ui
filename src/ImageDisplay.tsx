import { useState } from 'react'
import classNames from 'classnames'

import {
  ImageOverlay,
  PropTypes as OverlayProps,
} from '@/components/ImageOverlay'
import { ImageInfo } from '@/components/ImageInfo'
import { Dataset } from '@/App'

export type FitMode = 'fit' | 'full'

interface PropTypes extends OverlayProps {
  className: string
  selected?: Dataset
  onToggleShowOverlay: () => any
}

export default function ImageDisplay({
  className,
  selected,
  onToggleShowOverlay,
  ...overlayProps
}: PropTypes) {
  const [fitMode, setFitMode] = useState<FitMode>('fit')

  return (
    <div
      className={classNames(
        className,
        'flex flex-col flex-nowrap space-y-4 relative',
      )}
    >
      <ImageOverlay className="w-full" fitMode={fitMode} {...overlayProps} />
      <ImageInfo
        className="w-full"
        selected={selected}
        onToggleShowOverlay={onToggleShowOverlay}
        fitMode={fitMode}
        onChangeFitMode={setFitMode}
      />
    </div>
  )
}
