import classNames from 'classnames'

import {
  ImageOverlay,
  PropTypes as OverlayProps,
} from '@/components/ImageOverlay'
import { ImageInfo } from '@/components/ImageInfo'
import { Dataset } from '@/App'

/*
 * If you change the classes, change the integer to match, and vice versa
 * This is so tailwind can locate the class name correctly
 * See https://tailwindcss.com/docs/detecting-classes-in-source-files#dynamic-class-names
 */
export const IMAGE_INFO_HEIGHT = 48
const IMAGE_INFO_HEIGHT_CLASS = 'min-h-48'
const IMAGE_DISPLAY_HEIGHT_CLASS = 'h-[calc(100%_-_--spacing(48))]'

// These essentially work as assertions, because TS will throw an error at build time if they don't match
IMAGE_INFO_HEIGHT_CLASS === `min-h-${IMAGE_INFO_HEIGHT}`
IMAGE_DISPLAY_HEIGHT_CLASS === `h-[calc(100%_-_--spacing(${IMAGE_INFO_HEIGHT}))]`

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
      <ImageOverlay
        className={`w-full flex-shrink-0 ${IMAGE_DISPLAY_HEIGHT_CLASS}`}
        fitMode={fitMode}
        {...overlayProps}
      />
      <ImageInfo
        className={`w-full flex-shrink-1 ${IMAGE_INFO_HEIGHT_CLASS}`}
        selected={selected}
        onToggleShowOverlay={onToggleShowOverlay}
        fitMode={fitMode}
        onChangeFitMode={onChangeFitMode}
      />
    </div>
  )
}
