const KEYS = [
  {
    image: 'keyup.png',
    label: 'Previous',
  },
  {
    image: 'keydown.png',
    label: 'Next',
  },
  {
    image: 'keyright.png',
    label: 'Toggle Overlay',
  },
  {
    image: 'f-icon.png',
    label: 'QC: Pass ✅ | Fail ❌ | Artifact ⚠️',
  },
  {
    image: '0-9-icon.png',
    label: 'Rank',
  },
]

export default function Legend() {
  return (
    <div className="flex flex-wrap space-x-2 text-sm text-gray-700">
      {KEYS.map(({ image, label }) => (
        <div key={image} className="h-8 flex flex-row items-center space-x-1">
          <img src={`/public/${image}`} className="h-full object-contain" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}
