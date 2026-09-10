import { useEffect, useRef, useState } from 'react'

// Animates a displayed number toward `target` whenever it changes.
export function useCountUp(target, duration = 500) {
  const [display, setDisplay] = useState(target)
  const frame = useRef(null)
  const start = useRef(null)
  const from = useRef(target)

  useEffect(() => {
    from.current = display
    start.current = null

    function step(ts) {
      if (start.current === null) start.current = ts
      const progress = Math.min((ts - start.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const value = Math.round(from.current + (target - from.current) * eased)
      setDisplay(value)
      if (progress < 1) {
        frame.current = requestAnimationFrame(step)
      }
    }

    frame.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  return display
}
