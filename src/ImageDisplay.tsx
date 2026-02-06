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
  fitMode: FitMode
  onChangeFitMode: (f: FitMode) => any
}

export default function ImageDisplay({
  className,
  selected,
  onToggleShowOverlay,
  fitMode,
  onChangeFitMode,
  ...overlayProps
}: PropTypes) {
  return (
    <div
      className={classNames(
        className,
        'flex flex-col flex-nowrap space-y-4 relative',
      )}
    >
      <ImageOverlay className="w-full flex-shrink-0" fitMode={fitMode} {...overlayProps} />
      <ImageInfo
        className="w-full min-h-48 flex-shrink-1"
        selected={selected}
        onToggleShowOverlay={onToggleShowOverlay}
        fitMode={fitMode}
        onChangeFitMode={onChangeFitMode}
      />
    </div>
  )
}
