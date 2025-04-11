import classNames from 'classnames'

export default function KeyIcon({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  return (
    <div className="relative h-full min-w-8">
      <img src="images/key-icon.png" className="h-full" />
      <div className="absolute top-[calc(50%_-_2px)] left-1/2 -translate-x-1/2 -translate-y-1/2 text-shadow-sm">
        <div
          className={classNames(
            'text-nowrap text-shadow-[1px_0_0_currentColor] pr-0.5',
            className,
          )}
        >
          {label}
        </div>
      </div>
    </div>
  )
}
