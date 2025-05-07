import { useEffect } from 'react'

export default function useHandleOutsideKeydown(
  tbodyRef: React.RefObject<HTMLTableSectionElement | null>,
) {
  useEffect(() => {
    const handleOutsideKeyDown = (e: KeyboardEvent) => {
      if (!tbodyRef.current || tbodyRef.current.children.length === 0) {
        return
      }

      const key = e.key

      if (key !== 'ArrowDown') {
        return
      }

      ;(tbodyRef.current.children[0] as any).focus()
    }
    document.addEventListener('keydown', handleOutsideKeyDown)

    return () => {
      document.removeEventListener('keydown', handleOutsideKeyDown)
    }
  }, [tbodyRef.current])
}
