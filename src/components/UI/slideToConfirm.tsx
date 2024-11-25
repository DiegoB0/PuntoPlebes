'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation
} from 'framer-motion'

interface SlideToConfirmProps {
  text?: string
  fillColor?: string
  onConfirm?: () => void
}

export default function SlideToConfirm({
  text = 'Slide to confirm payment',
  fillColor = '#f33f7e',
  onConfirm
}: SlideToConfirmProps) {
  const [sliderWidth, setSliderWidth] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const constraintsRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const xInput = [0, sliderWidth]
  const backgroundWidth = useTransform(x, xInput, ['0%', '100%'])
  const controls = useAnimation()

  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.offsetWidth - 64)
    }
  }, [])

  const handleDragEnd = () => {
    const currentX = x.get()
    if (currentX >= sliderWidth - 0) {
      controls.start({ x: sliderWidth })
      onConfirm && onConfirm()
    } else {
      controls.start({ x: 0 })
    }
  }

  return (
    <div
      ref={sliderRef}
      className="relative h-10 w-full max-w-md overflow-hidden rounded-md bg-gray-200 shadow-md">
      <motion.div
        className="absolute inset-y-0 left-0 z-0"
        style={{
          width: backgroundWidth,
          backgroundColor: fillColor
        }}
      />
      <div
        ref={constraintsRef}
        className="absolute inset-0 flex items-center px-2">
        <span className="z-10 ml-24 text-sm font-medium text-gray-800">
          {text}
        </span>
        <motion.div
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          animate={controls}
          style={{ x }}
          className="absolute left-2 z-20 flex h-9 w-9 cursor-grab items-center justify-center rounded-full bg-white shadow-lg">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </motion.div>
      </div>
    </div>
  )
}
