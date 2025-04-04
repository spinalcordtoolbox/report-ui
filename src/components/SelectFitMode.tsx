import { useId } from 'react'
import classNames from 'classnames'

import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'
import { FitMode } from '@/ImageDisplay'

export default function Component({
  fitMode,
  onChangeFitMode,
}: {
  fitMode: FitMode
  onChangeFitMode: (m: FitMode) => any
}) {
  const id = useId()

  return (
    <div className="inline-flex h-10 rounded-md border-gray-500 border-1 p-0.5">
      <RadioGroup
        value={fitMode}
        onValueChange={onChangeFitMode}
        className="group relative inline-grid grid-cols-[1fr_1fr] items-center gap-0 font-medium"
        data-state={fitMode}
      >
        <label
          className={classNames(
            'w-36 relative z-10',
            'group-data-[state=full]:text-muted-foreground group-data-[state=full]:hover:text-foreground',
            'group-data-[state=full]:hover:bg-gray-100',
            'group-data-[state=fit]:font-bold',
            'inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4 pl-6',
            'whitespace-nowrap transition-colors select-none',
            'space-x-2',
            'border-r-1 border-gray-500',
          )}
        >
          <span className="leading-0">Fit to height</span>
          <span>&#8597;</span>
          <RadioGroupItem id={`${id}-1`} value="fit" className="sr-only" />
        </label>
        <label
          className={classNames(
            'w-36 relative z-10',
            'group-data-[state=fit]:text-muted-foreground group-data-[state=fit]:hover:text-foreground',
            'group-data-[state=fit]:hover:bg-gray-100',
            'group-data-[state=full]:font-bold',
            'inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4 pr-2',
            'whitespace-nowrap transition-colors select-none',
            'space-x-2',
          )}
        >
          <span className="leading-0">Full size</span>
          <span>
            &nbsp;
            <sup>⇱</sup>
            <sub>⇲</sub>
          </span>
          <RadioGroupItem id={`${id}-2`} value="full" className="sr-only" />
        </label>
      </RadioGroup>
    </div>
  )
}
