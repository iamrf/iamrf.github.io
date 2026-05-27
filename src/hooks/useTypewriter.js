import { useState, useEffect, useRef } from 'react'

export function useTypewriter(texts, speed = 80, pause = 2200, resetKey = '') {
  const [displayText, setDisplayText] = useState('')
  const [index, setIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const textsRef = useRef(texts)

  useEffect(() => {
    textsRef.current = texts
    setDisplayText('')
    setIndex(0)
    setIsDeleting(false)
  }, [resetKey])

  useEffect(() => {
    const current = textsRef.current[index] ?? ''

    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false)
        setIndex((i) => (i + 1) % textsRef.current.length)
        return
      }
      const t = setTimeout(
        () => setDisplayText(current.slice(0, displayText.length - 1)),
        speed / 2,
      )
      return () => clearTimeout(t)
    }

    if (displayText === current) {
      const t = setTimeout(() => setIsDeleting(true), pause)
      return () => clearTimeout(t)
    }

    const t = setTimeout(
      () => setDisplayText(current.slice(0, displayText.length + 1)),
      speed,
    )
    return () => clearTimeout(t)
  }, [displayText, index, isDeleting, speed, pause])

  return displayText
}
