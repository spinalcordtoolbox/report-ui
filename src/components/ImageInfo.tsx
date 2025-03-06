import classNames from 'classnames'
import { Dataset } from '../App'

export function ImageInfo({
  selected,
  onToggleShowOverlay,
}: {
  selected?: Dataset
  onToggleShowOverlay: () => void
}) {
  return selected ? (
    <>
      <button
        onClick={onToggleShowOverlay}
        className={classNames(
          'hidden lg:block h-10 w-fit border-gray-500 border-1 rounded-sm mb-1 self-start',
          'cursor-pointer hover:bg-gray-100/50 active:bg-gray-100 transition-colors',
        )}
      >
        <div className="h-full w-fit py-1 px-4 flex flex-row flex-nowrap items-center space-x-2">
          <span className="leading-0">Toggle overlay</span>
          <img className="h-full" src="/keyright.png" />
        </div>
      </button>
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
    </>
  ) : null
}
