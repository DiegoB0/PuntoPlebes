'use client'

import { useState, useRef, useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation
} from 'framer-motion'
import { BsArrowRight } from 'react-icons/bs'
import { Spinner } from '@nextui-org/react'

interface SlideToConfirmProps {
  text?: string
  fillColor?: string
  onConfirm?: () => void
  className?: string
  loading?: boolean
  onProgress?: (progress: number) => void
  onSlideStart?: () => void
  resetTrigger?: boolean
}
export default function SlideToConfirm({
  text = 'Slide to confirm payment',
  fillColor = '#f33f7e',
  onConfirm,
  className = '',
  loading = false,
  onProgress,
  onSlideStart,
  resetTrigger
}: SlideToConfirmProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const x = useMotionValue(0)
  const controls = useAnimation()

  const dragLimit = Math.max(0, dimensions.width - dimensions.height)

  // Reset functionality
  useEffect(() => {
    controls.start({ x: 0 })
  }, [resetTrigger, controls])

  // Progress reporting
  useEffect(() => {
    const unsubscribe = x.onChange((value) => {
      if (dragLimit > 0) {
        const progress = (value / dragLimit) * 100
        onProgress?.(progress)
      }
    })
    return () => unsubscribe()
  }, [dragLimit, onProgress, x])

  // Dimension tracking
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
    return () => window.removeEventListener('resize', updateDimensions)
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
        drag={loading ? false : 'x'}
        dragConstraints={{
          left: 0,
          right: dragLimit
        }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => onSlideStart?.()}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className={`absolute left-1 top-1 z-20 flex h-12 w-12 cursor-grab items-center justify-center rounded-full bg-white shadow-lg transition-shadow hover:shadow-md ${
          loading ? 'cursor-not-allowed' : ''
        }`}
        whileHover={{ scale: loading ? 1 : 1.1 }}
        whileTap={{ scale: loading ? 1 : 0.9 }}>
        {loading ? (
          <Spinner size="sm" color="default" className="text-gray-600" />
        ) : (
          <BsArrowRight className="h-5 w-5 text-gray-600" />
        )}
      </motion.div>
    </div>
  )
}
