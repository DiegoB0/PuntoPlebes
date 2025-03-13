import React from 'react'

import { Button } from '@nextui-org/react'

interface FileInputProps {
  label: string
  errorMessage?: string
  onChange: (file: File | null) => void
  className?: string
}

const FileInput: React.FC<FileInputProps> = ({
  label,
  errorMessage,
  onChange,
  className
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    onChange(file)
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-medium mb-2">{label}</label>
      <input
        type="file"
        accept="image/*"
        id="file-input"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <label htmlFor="file-input">
        <Button as="span" className="mt-2 w-full">
          Elige una imagen
        </Button>
      </label>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  )
}

export default FileInput
