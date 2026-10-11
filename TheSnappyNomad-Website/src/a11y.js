import { useEffect } from 'react'

// Shared dialog behavior: lock body scroll, move focus into the dialog,
// trap Tab inside it, close on Escape, and hand focus back on close.
export function useDialogA11y(ref, onClose) {
  useEffect(() => {
    const opener = document.activeElement
    document.body.style.overflow = 'hidden'

    const focusables = () => {
      const node = ref.current
      if (!node) return []
      return [
        ...node.querySelectorAll(
          'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ),
      ].filter((el) => !el.disabled)
    }

    focusables()[0]?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      opener?.focus?.()
    }
  }, [ref, onClose])
}
