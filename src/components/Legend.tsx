import KeyIcon from '@/components/KeyIcon'

const KEYS = [
  [
    {
      key: '↑',
      label: 'Previous',
      iconClassName: 'pb-1',
    },
    {
      key: '↓',
      label: 'Next',
      iconClassName: 'pb-1',
    },
    {
      key: '→',
      label: 'Toggle Overlay',
      iconClassName: 'pb-1',
    },
    {
      key: 'D',
      label: 'Toggle image fit',
    },
  ],
  [
    {
      key: 'F',
      label: (
        <>
          <span className="font-bold">QC</span>: Pass ✅ | Fail ❌ | Artifact ⚠️
        </>
      ),
    },
    {
      key: '0-9',
      label: 'Rank',
      iconClassName: 'text-xs',
    },
  ],
]

export default function Legend() {
  return KEYS.map((row, i) => (
    <div key={i} className="flex flex-wrap space-x-2 text-sm text-gray-700">
      {row.map(({ key, label, iconClassName }) => (
        <div
          key={key}
          className="h-8 flex flex-row flex-nowrap items-center space-x-1"
        >
          <KeyIcon label={key} className={iconClassName} />
          <span className="text-nowrap">{label}</span>
        </div>
      ))}
    </div>
  ))
}
