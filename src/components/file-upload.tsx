'use client'

import { OutputConfig } from '@/app/dashboard/page'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n/i18n-context'
import { Upload } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import ConfigurationPanel from './configuration-panel'
import FilesList from './files-list'

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void
  isProcessing: boolean
  outputConfig: OutputConfig
  onConfigChange: (config: OutputConfig) => void
}

export default function FileUpload({
  onFilesUploaded,
  isProcessing,
  outputConfig,
  onConfigChange,
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const { t } = useI18n()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const resumeFiles = acceptedFiles.filter(
      (file) =>
        file.type === 'application/pdf' ||
        file.type === 'application/msword' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type.startsWith('image/')
    )
    setSelectedFiles((prev) => [...prev, ...resumeFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    multiple: true,
  })

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onFilesUploaded(selectedFiles)
      setSelectedFiles([])
    }
  }

  return (
    <div className="space-y-6 w-3/4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <CardContent className="p-8">
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <div className="text-center space-y-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive
                    ? t('fileUpload.dragDrop')
                    : t('fileUpload.dragDrop')}
                </p>
                <p className="text-sm text-gray-500">
                  {t('fileUpload.clickToSelect')}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                {t('fileUpload.supportedFormats')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <span className="flex gap-4 w-full">
        <FilesList
          selectedFiles={selectedFiles}
          isProcessing={isProcessing}
          onRemoveFile={removeFile}
          onUpload={handleUpload}
        />
        <ConfigurationPanel
          outputConfig={outputConfig}
          onConfigChange={onConfigChange}
        />
      </span>
    </div>
  )
}
