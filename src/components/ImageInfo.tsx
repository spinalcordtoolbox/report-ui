import { Dataset } from 'App'
import Button from 'components/Button'

export function ImageInfo({
  selected,
  onToggleShowOverlay,
}: {
  selected?: Dataset
  onToggleShowOverlay: () => void
}) {
  return selected ? (
    <>
      <Button onClick={onToggleShowOverlay}>
        <span className="leading-0">Toggle overlay</span>
        <img className="h-full" src="keyright.png" />
      </Button>
      <div className="w-full h-36 flex flex-col overflow-y-scroll overflow-x-clip p-2 border-gray-500 rounded-sm border-1">
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
