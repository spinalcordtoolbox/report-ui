import KeyIcon from '@/components/KeyIcon'

const KEYS = [
  {
    key: '↑',
    label: 'Previous',
    className: 'pb-1',
  },
  {
    key: '↓',
    label: 'Next',
    className: 'pb-1',
  },
  {
    key: '→',
    label: 'Toggle Overlay',
    className: 'pb-1',
  },
  {
    key: 'F',
    label: (
      <>
        <span className="font-bold">QC</span>: Pass ✅ | Fail ❌ | Artifact ⚠️
      </>
    ),
  },
  {
    key: 'D',
    label: 'Toggle image fit',
  },
  {
    key: '0-9',
    label: 'Rank',
    className: 'text-xs',
  },
]

export default function Legend() {
  return (
    <div className="flex flex-wrap space-x-2 text-sm text-gray-700">
      {KEYS.map(({ key, label, className }) => (
        <div key={key} className="h-8 flex flex-row items-center space-x-1">
          <KeyIcon label={key} className={className} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}
