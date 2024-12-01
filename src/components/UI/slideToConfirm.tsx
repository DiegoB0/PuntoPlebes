'use client'

import { useState, useRef, useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation
} from 'framer-motion'
import { BsArrowRight } from 'react-icons/bs'

interface SlideToConfirmProps {
  text?: string
  fillColor?: string
  onConfirm?: () => void
  className?: string
}

export default function SlideToConfirm({
  text = 'Slide to confirm payment',
  fillColor = '#f33f7e',
  onConfirm,
  className = ''
}: SlideToConfirmProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const x = useMotionValue(0)
  const controls = useAnimation()

  // Calculate the maximum drag distance (container width minus handle width)
  const dragLimit = Math.max(0, dimensions.width - dimensions.height)

  // Update dimensions on mount and window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  const handleDragEnd = () => {
    const currentX = x.get()
    if (dragLimit > 0 && currentX >= dragLimit * 0.9) {
      controls.start({ x: dragLimit })
      onConfirm?.()
    } else {
      controls.start({ x: 0 })
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-14 w-full overflow-hidden rounded-lg bg-gray-100 shadow-md ${className}`}>
      {/* Sliding background */}
      <motion.div
        className="absolute inset-y-0 left-0 z-0"
        style={{
          width: useTransform(x, [0, dragLimit], ['0%', '100%']),
          backgroundColor: fillColor
        }}
      />

      {/* Text layer */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-sm font-medium transition-colors"
          style={{
            color: useTransform(
              x,
              [0, dragLimit * 0.5, dragLimit],
              ['rgb(31, 41, 55)', 'rgb(31, 41, 55)', 'rgb(255, 255, 255)']
            )
          }}>
          {text}
        </motion.span>
      </div>

      {/* Sliding handle */}
      <motion.div
        drag="x"
        dragConstraints={{
          left: 0,
          right: dragLimit
        }}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="absolute left-1 top-1 z-20 flex h-12 w-12 cursor-grab items-center justify-center rounded-full bg-white shadow-lg transition-shadow hover:shadow-md active:cursor-grabbing">
        <BsArrowRight className="h-5 w-5 text-gray-600" />
      </motion.div>
    </div>
  )
}
