import { useRef } from 'react'

const MIN_HEIGHT = 80
const MAX_HEIGHT = 500
const DEFAULT_HEIGHT = 180

interface ResizeHandleProps {
  currentHeight: number
  onResize: (height: number) => void
}

export function ResizeHandle({ currentHeight, onResize }: ResizeHandleProps) {
  const startY = useRef(0)
  const startHeight = useRef(currentHeight)
  const isDragging = useRef(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
    startHeight.current = currentHeight
    isDragging.current = true
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    const delta = e.touches[0].clientY - startY.current
    const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startHeight.current + delta))
    onResize(newHeight)
  }

  const handleTouchEnd = () => { isDragging.current = false }

  const handleMouseDown = (e: React.MouseEvent) => {
    startY.current = e.clientY
    startHeight.current = currentHeight
    isDragging.current = true

    const onMouseMove = (me: MouseEvent) => {
      if (!isDragging.current) return
      const delta = me.clientY - startY.current
      const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startHeight.current + delta))
      onResize(newHeight)
    }
    const onMouseUp = () => {
      isDragging.current = false
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const handleDoubleClick = () => onResize(DEFAULT_HEIGHT)

  return (
    <div
      className="flex items-center justify-center h-5 cursor-row-resize select-none group"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      title="Ziehen zum Resize | Doppelklick für Standard"
    >
      <div className="flex gap-0.5">
        {[0,1,2].map(i => (
          <div key={i} className="w-6 h-0.5 rounded-full bg-surface-3 group-hover:bg-kotlin/50 transition-colors" />
        ))}
      </div>
    </div>
  )
}
