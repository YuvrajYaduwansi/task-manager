import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

type TypewriterProps = {
  text: string
  className?: string
  delayMs?: number
  speedMs?: number
}

export function Typewriter({
  text,
  className,
  delayMs = 0,
  speedMs = 28,
}: TypewriterProps) {
  const reduceMotion = useReducedMotion()
  const [count, setCount] = useState(0)
  const shown = reduceMotion ? text : text.slice(0, count)
  const typing = !reduceMotion && count < text.length

  useEffect(() => {
    if (reduceMotion || count >= text.length) return

    const timeout = window.setTimeout(
      () => setCount((current) => current + 1),
      count === 0 ? delayMs : speedMs,
    )
    return () => window.clearTimeout(timeout)
  }, [count, delayMs, reduceMotion, speedMs, text.length])

  return (
    <p className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {shown}
        {typing ? (
          <motion.span
            className="ml-0.5 inline-block h-[1em] w-px translate-y-px bg-accent align-middle"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : null}
      </span>
    </p>
  )
}
