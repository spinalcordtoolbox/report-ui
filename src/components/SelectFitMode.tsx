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
    <div className="bg-input/50 inline-flex h-10 rounded-md  p-0.5">
      <RadioGroup
        value={fitMode}
        onValueChange={onChangeFitMode}
        className={classNames(
          'group after:bg-background has-focus-visible:after:border-ring has-focus-visible:after:ring-ring/50',
          'relative inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium',
          'after:absolute after:inset-y-0 after:w-1/2 after:rounded-sm after:shadow-xs',
          'after:transition-[translate,box-shadow] after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)]',
          'has-focus-visible:after:ring-[3px] data-[state=fit]:after:translate-x-0 data-[state=full]:after:translate-x-full',
        )}
        data-state={fitMode}
      >
        <label
          className={classNames(
            'group-data-[state=full]:text-muted-foreground/70 relative z-10',
            'inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4',
            'whitespace-nowrap transition-colors select-none',
            'space-x-2',
          )}
        >
          <span className="leading-0">Fit to height</span>
          <span>&#8597;</span>
          <RadioGroupItem id={`${id}-1`} value="fit" className="sr-only" />
        </label>
        <label
          className={classNames(
            'group-data-[state=fit]:text-muted-foreground/70 relative z-10',
            'inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4',
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
