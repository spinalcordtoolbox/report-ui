import classNames from 'classnames'
import { useMemo } from 'react'

export default function SearchBox({
  value,
  onChange,
  ref,
}: {
  value: string
  onChange: (s: string) => any
  ref: React.RefObject<HTMLInputElement | null>
}) {
  const isMac = useMemo(() => navigator.userAgent.includes('Mac'), [])
  const hasFocus = document.activeElement === ref.current

  return (
    <div>
      <label
        htmlFor="search"
        className="text-sm/6 font-medium text-gray-900 hidden"
      >
        Search
      </label>
      <div
        className={classNames(
          'flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300',
          'has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600',
          'relative',
        )}
      >
        <input
          ref={ref}
          type="text"
          name="search"
          id="search"
          className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
          placeholder="&#x1F50E;&#xFE0E; Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div
          className={classNames(
            'absolute right-4 flex items-center space-x-2 transition-opacity',
            {
              'opacity-0': hasFocus,
            },
          )}
        >
          <span className="border border-border p-1 text-xs text-gray-700 rounded-sm">
            /
          </span>
          <span className="text-xs text-gray-700 rounded-sm">or</span>
          <span className="border border-border p-1 text-xs text-gray-700 rounded-sm">
            {isMac ? 'cmd' : 'ctrl'}
          </span>
          <span className="border border-border p-1 text-xs text-gray-700 rounded-sm">
            k
          </span>
        </div>
      </div>
    </div>
  )
}
